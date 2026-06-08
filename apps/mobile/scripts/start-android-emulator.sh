#!/usr/bin/env bash
set -euo pipefail

avd_name="${ANDROID_AVD_NAME:-react_monorepo_mobile}"
system_image="${ANDROID_SYSTEM_IMAGE:-system-images;android-36;google_apis_playstore;x86_64}"
device_name="${ANDROID_DEVICE:-pixel_6}"
boot_timeout="${ANDROID_BOOT_TIMEOUT:-180}"
avd_ram_mb="${ANDROID_AVD_RAM_MB:-8192}"
avd_heap_mb="${ANDROID_AVD_HEAP_MB:-1024}"
avd_cores="${ANDROID_AVD_CORES:-8}"
# `auto` lets the emulator's gfxstream backend pick a working renderer.
# Override with e.g. `host` (needs working host GL + GLX; on NixOS Wayland
# this typically fails because the bundled libs can't talk to XWayland's
# GLX), `swiftshader` (pure software), or `lavapipe` (software Vulkan).
avd_gpu_mode="${ANDROID_AVD_GPU_MODE:-auto}"
emulator_args="${ANDROID_EMULATOR_ARGS:--netdelay none -netspeed full -gpu ${avd_gpu_mode} -memory ${avd_ram_mb} -cores ${avd_cores}}"

# On NixOS, expose the host's GL/Vulkan stack to the emulator so its Vulkan
# code path can detect the discrete GPU even when `-gpu host` itself fails.
if [[ -d /run/opengl-driver/lib ]]; then
	export LD_LIBRARY_PATH="/run/opengl-driver/lib:${LD_LIBRARY_PATH:-}"
fi
if [[ -z "${VK_ICD_FILENAMES:-}" && -f /run/opengl-driver/share/vulkan/icd.d/nvidia_icd.json ]]; then
	export VK_ICD_FILENAMES="/run/opengl-driver/share/vulkan/icd.d/nvidia_icd.json"
fi

missing_tools=()
for tool in adb emulator avdmanager; do
	if ! command -v "$tool" >/dev/null 2>&1; then
		missing_tools+=("$tool")
	fi
done

if ((${#missing_tools[@]} > 0)); then
	printf 'Missing Android tool(s): %s\n' "${missing_tools[*]}" >&2
	printf 'Enter the repo dev shell with `nix develop`, then retry `bun run dev:mobile`.\n' >&2
	exit 1
fi

if adb devices | awk 'NR > 1 && $2 == "device" { found = 1 } END { exit !found }'; then
	printf 'Android device or emulator is already connected.\n'
	exit 0
fi

mkdir -p "${ANDROID_AVD_HOME:-$HOME/.android/avd}"

if ! emulator -list-avds | grep -Fxq "$avd_name"; then
	printf 'Creating Android emulator `%s` using `%s`.\n' "$avd_name" "$system_image"
	if ! avdmanager create avd --force --name "$avd_name" --package "$system_image" --device "$device_name" >/dev/null; then
		avdmanager create avd --force --name "$avd_name" --package "$system_image" >/dev/null
	fi
fi

# Patch the AVD config so direct `emulator -avd <name>` launches are also fast.
avd_config="${ANDROID_AVD_HOME:-$HOME/.android/avd}/${avd_name}.avd/config.ini"
if [[ -f "$avd_config" ]]; then
	declare -A avd_overrides=(
		[hw.gpu.enabled]=yes
		[hw.gpu.mode]="$avd_gpu_mode"
		[hw.ramSize]="$avd_ram_mb"
		[vm.heapSize]="$avd_heap_mb"
		[hw.cpu.ncore]="$avd_cores"
		[hw.lcd.depth]=32
		[hw.keyboard]=yes
	)
	for key in "${!avd_overrides[@]}"; do
		value="${avd_overrides[$key]}"
		if grep -q "^${key}=" "$avd_config"; then
			sed -i "s|^${key}=.*|${key}=${value}|" "$avd_config"
		else
			printf '%s=%s\n' "$key" "$value" >>"$avd_config"
		fi
	done
fi

printf 'Starting Android emulator `%s`.\n' "$avd_name"
log_file="${ANDROID_EMULATOR_LOG:-$HOME/.android/$avd_name.log}"
nohup emulator -avd "$avd_name" $emulator_args >"$log_file" 2>&1 &

printf 'Waiting for emulator to boot.\n'
adb wait-for-device

deadline=$((SECONDS + boot_timeout))
while ((SECONDS < deadline)); do
	if [[ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; then
		adb shell input keyevent 82 >/dev/null 2>&1 || true
		printf 'Android emulator is ready.\n'
		exit 0
	fi
	sleep 2
done

printf 'Timed out waiting for Android emulator. See %s for emulator logs.\n' "$log_file" >&2
exit 1
