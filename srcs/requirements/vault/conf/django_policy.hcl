
path "secret/api42" {
  capabilities = ["read"]
}

path "database/creds/dbuser_wo" {
  capabilities = ["read", "list"]
}
