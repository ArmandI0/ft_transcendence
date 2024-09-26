# vault.hcl

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1 #non recommande en production
}

storage "file" {
  path = "/vault/data"
}

ui = true
api_addr = "http://vault:8200"
