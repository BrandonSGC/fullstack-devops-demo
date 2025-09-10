variable "subscription_id" {
  description = "The Azure Subscription ID for the providers.tf file"
  type        = string
  sensitive   = true
}

variable "rg_name" {
  description = "The name of the Resource Group"
  type        = string
  default     = "rg-fullstack-devops-demo"
}

variable "location" {
  description = "The Azure region to deploy resources in"
  type        = string
  default     = "Canada Central"
}

variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "fullstackdb"
}

variable "db_admin" {
  description = "The database administrator username"
  type        = string
  sensitive   = true
}
variable "db_password" {
  description = "The database administrator password"
  type        = string
  sensitive   = true
}
