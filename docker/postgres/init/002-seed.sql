insert into sample_customers (name, tier, active)
values
  ('Acme Co', 'starter', true),
  ('Northwind Traders', 'growth', true),
  ('Globex Corporation', 'enterprise', true)
on conflict do nothing;
