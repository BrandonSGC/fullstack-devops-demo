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

  delegation {
    name = "backend-delegation"
    service_delegation {
      name = "Microsoft.Web/serverFarms"
    }
  }
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

  # VNet Integration
  virtual_network_subnet_id = azurerm_subnet.backend_subnet.id


  site_config {
    application_stack {
      docker_registry_url = "https://index.docker.io"
      docker_image_name   = "brandonsgc/backend-app:latest"
    }
  }

  app_settings = {
    "DB_HOST"       = azurerm_mysql_flexible_server.mysql_server.fqdn
    "DB_USER"       = var.db_admin
    "DB_PASS"       = var.db_password
    "DB_NAME"       = var.db_name
    "DB_PORT"       = var.db_port
    "NODE_ENV"      = "production"
    "PORT"          = "3030"
    "WEBSITES_PORT" = "3030"
  }

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

// MySQL Server
resource "azurerm_mysql_flexible_server" "mysql_server" {
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

// Create DB
resource "azurerm_mysql_flexible_database" "db" {
  name                = "fullstackdb"
  resource_group_name = var.rg_name
  server_name         = azurerm_mysql_flexible_server.mysql_server.name
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}

// Outputs
output "backend_url" {
  value = azurerm_linux_web_app.backend.default_hostname
}

output "frontend_url" {
  value = azurerm_static_web_app.frontend.default_host_name
}

output "mysql_host" {
  value = azurerm_mysql_flexible_server.mysql_server.fqdn
}

output "mysql_db" {
  value = azurerm_mysql_flexible_database.db.name
}
