// Resource Group
resource "azurerm_resource_group" "rg" {
  name     = var.rg_name
  location = var.location
}

// Networking (VNet + Subnets)
resource "azurerm_virtual_network" "vnet" {
  name                = "fullstack-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

// Subnet for backend App Service.
resource "azurerm_subnet" "backend_subnet" {
  name                 = "backend-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

// Subnet for Database.
resource "azurerm_subnet" "db_subnet" {
  name                 = "db-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]
  delegation {
    name = "db-delegation"
    service_delegation {
      name = "Microsoft.DBforMySQL/flexibleServers"
    }
  }
}

# App Service Plan - For backend container
resource "azurerm_service_plan" "plan" {
  name                = "fullstack-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

// App Service - For backend container
resource "azurerm_linux_web_app" "backend" {
  name                = "fullstack-backend-bgc"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {}

  depends_on = [azurerm_service_plan.plan]
}

# Create Static Web App to host the React frontend
resource "azurerm_static_web_app" "frontend" {
  name                = "fullstack-frontend-bgc"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "eastus2"
  sku_tier            = "Free"
  sku_size            = "Free"
  depends_on          = [azurerm_resource_group.rg]
}

// MySQL Server in VNet
resource "azurerm_mysql_flexible_server" "db" {
  name                   = var.db_name
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  administrator_login    = var.db_admin
  administrator_password = var.db_password
  backup_retention_days  = 7
  delegated_subnet_id    = azurerm_subnet.db_subnet.id
  sku_name               = "B_Standard_B1ms"
  version                = "8.0.21"

  depends_on = [azurerm_subnet.db_subnet]
}

// Outputs
output "backend_url" {
  value = azurerm_linux_web_app.backend.default_hostname
}

output "mysql_host" {
  value = azurerm_mysql_flexible_server.db.fqdn
}
