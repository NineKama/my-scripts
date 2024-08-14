resource "azapi_resource" "storage_container" {
  type      = "Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01"
  name      = "content"
  parent_id = azapi_resource.storage_account.id

  body = jsonencode({
    properties = {
      publicAccess = "None"
    }
  })
}
