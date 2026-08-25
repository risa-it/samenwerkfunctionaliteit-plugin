# Plugin Documentation

<!-- Use this page to document your plugin. Below is a suggested structure. -->

## Overview

This is a sample plugin demonstrating an API call action. It fetches data from a time API endpoint.

## Dependencies

### Backend

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:samenwerkfunctionaliteit-plugin:0.1.0")
}
```

### Frontend

```json
{
  "dependencies": {
    "@valtimo-plugins/samenwerkfunctionaliteit-plugin": "0.1.0"
  }
}
```

In your `app.module.ts`:

```typescript
import {
    SamenwerkfunctionaliteitPluginModule, samenwerkfunctionaliteitPluginSpecification,
} from '@valtimo-plugins/samenwerkfunctionaliteit';

@NgModule({
    imports: [
        SamenwerkfunctionaliteitPluginModule,
    ],
    providers: [
        {
            provide: PLUGIN_TOKEN,
            useValue: [
                samenwerkfunctionaliteitPluginSpecification,
            ]
        }
    ]
})
```

### API Gateway

To enable the API proxy from the backend to the Samenwerkfunctionaliteit API, use to following settings in the *
*application.yml**:

```yaml
valtimo:
  samenwerkfunctionaliteit:
    gateway:
      enabled: true
```

Additional headers can be added to the gateway via `customHeaders`in the _"application.yml"_.

```yaml
valtimo:
  samenwerkfunctionaliteit:
    gateway:
      customHeaders:
        header-name-1: "header-value-1"
        header-name-2: "header-value-2"
```

By default, the baseurl of the API is based on the Samenwerkfunctionaliteit pluginconfiguration.
This can be overridden in the _"application.yml"_ with the baseUrl property:

```yaml
valtimo:
  samenwerkfunctionaliteit:
    gateway:
      baseUrl: "https://example.com/samenwerkfunctionaliteit/v5"
```

The API Gateway uses access control to manage user permissions.
Access to the gateway can be granted on a per-user basis through PBAC. The following actions are available:

| Action | Function                      |
|--------|-------------------------------|
| View   | GET, HEAD and OPTION requests |
| Create | POST requests                 |
| Modify | PUT and Patch requests        |
| Delete | DELETE requests               |

The following example grants a user role permission to perform all available actions on the API Gateway:

```json
 {
  "resourceType": "com.ritense.valtimoplugins.samenwerkfunctionaliteit.gateway.GatewayProperties",
  "actions": [
    "view",
    "create",
    "modify",
    "delete"
  ],
  "roleKey": "ROLE_USER",
  "conditions": []
}
```

### Frontend configuration

#### Uploading files within the Samenwerkingsfunctionaliteit API
The SWF API supports uploading, retrieving, and deleting files within a collaboration (_Samenwerking_).

To support more fine-grained storage policies, the plugin also supports uploading a backup copy to the Documenten API, which is part of the Zaakgericht Werken domain. When this option is enabled, the file is first uploaded to Open Zaak. The UUID of the uploaded document is then passed as the `kenmerkSysteem`  query parameter when uploading the file to the SWF API. This makes it easier to track the uploaded document across both systems.

To enable uploading a backup file to the associated Open Zaak case, follow these steps:

1. In `application.yaml`, add the following property: 
```yaml
valtimo:
    samenwerkfunctionaliteit:
        frontend:
            documents:
                upload-backup-to-documenten-api: true
```
2. Configure the upload process for your case. [See the documentation for configuring the case upload process](https://docs.valtimo.nl/features/case/zgw/zgw-documents/upload-to-documenten-api-with-metadata#configuring-the-case-upload-process). 

## Configuration

List the plugin configuration properties and how to set them.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
|          |      |          |             |

## Actions

### Time API test action

Sends a GET request to the configured API URL and returns the timezone response.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
|           |      |          |             |

### GET getActieverzoek

Sends a GET request to retrieve a single **actieverzoek** (action request).
**Usage:** Add this plugin action to an **operaton service task** in your process. The result of this request must be
stored in an **operaton process variable**, for example **"actieverzoek"**.

| Parameter      | Type | Required | Description                                                                         |
|----------------|------|----------|-------------------------------------------------------------------------------------|
| resultPvName   | Text | Yes      | The name of the process variable you'd like to store the requested actieverzoek in. |
| actieverzoekId | Text | Yes      | The id of the requested actieverzoek.                                               |

Voorbeeld `*.processlink.json`:

```json
{
  "activityId": "Activity_00fynp6",
  "activityType": "bpmn:ServiceTask:start",
  "pluginConfigurationId": "12023724-a4bd-431d-93c0-5ba52049e9cd",
  "pluginActionDefinitionKey": "get-actieverzoek",
  "actionProperties": {
    "resultPvName": "actieverzoek",
    "actieverzoekId": "pv:actieverzoekId"
  },
  "processLinkType": "plugin"
}
```

![get-actieverzoek.png](img/get-actieverzoek.png)

---

### GET getAlleActieverzoeken

Sends a GET request to retrieve all **actieverzoeken** (action requests) of a **samenwerking**.
**Usage:** Add this plugin action to an **operaton service task** in your process. The result of this request must be
stored in an **operaton process variable**, for example **"actieverzoeken"**.

| Parameter                 | Type | Required | Description                                                                                                                    |
|---------------------------|------|----------|--------------------------------------------------------------------------------------------------------------------------------|
| resultPvName              | Text | Yes      | The name of the process variable you'd like to store the requested actieverzoeken in.                                          |
| samenwerkingId            | Text | Yes      | The id of the samenwerking of which all actieverzoeken will be requested.                                                      |
| isOrganisationTheReceiver | Text | No       | If the requested actieverzoeken should be filtered for the requesting organisatie. An optional boolean which defaults to true. |

Voorbeeld `*.processlink.json`:

```json
{
  "activityId": "Activity_GetAlleActieverzoeken",
  "activityType": "bpmn:ServiceTask:start",
  "pluginConfigurationId": "12023724-a4bd-431d-93c0-5ba52049e9cd",
  "pluginActionDefinitionKey": "get-all-actieverzoeken",
  "actionProperties": {
    "resultPvName": "actieverzoeken",
    "samenwerkingId": "pv:samenwerkingId",
    "isOrganisationTheReceiver": "pv:isOrganisationTheReceiver"
  },
  "processLinkType": "plugin"
}
```

![get-alle-actieverzoeken.png](img/get-alle-actieverzoeken.png)
---

### GET getSamenwerkingenNotificaties

Sends a GET request to retrieve all **actieverzoeken** (action requests) of a **samenwerking**.
**Usage:** Add this plugin action to an **operaton service task** in your process. The result of this request must be
stored in an **operaton process variable**, for example **"actieverzoeken"**.

| Parameter      | Type | Required | Description                                                                           |
|----------------|------|----------|---------------------------------------------------------------------------------------|
| resultPvName   | Text | Yes      | The name of the process variable you'd like to store the requested actieverzoeken in. |
| samenwerkingId | Text | Yes      | The id of the samenwerking of which all actieverzoeken will be requested.             |

Voorbeeld `*.processlink.json`:

```json
{
   "activityId": "Activity_GetSamenwerkingNotificaties",
   "activityType": "bpmn:ServiceTask:start",
   "pluginConfigurationId": "12023724-a4bd-431d-93c0-5ba52049e9cd",
   "pluginActionDefinitionKey": "get-samenwerking-notificaties",
   "actionProperties": {
      "resultPvName": "notificaties",
      "samenwerkingId": "pv:samenwerkingId"
   },
   "processLinkType": "plugin"
}
```

![get-samenwerking-notificaties.png](img/get-samenwerking-notificaties.png)
---

## Usage

### How to Use the Plugin in a Process

Explain how to use the plugin in a process, with examples if applicable.

1. **Configure the Plugin**
   Set the `apiUrl` property in the plugin configuration to the base URL of your API.

2. **Add Actions to Operaton Service Tasks**
   - For retrieving a single **actieverzoek**, use the **GET getActieverzoek** action in an operaton service task.
   - For retrieving all **actieverzoeken**, use the **GET getAlleActieverzoeken** action in an operaton service task.

3. **Store the Results**
   - The result of **GET getActieverzoek** must be stored in an operaton process variable named **"actieverzoek"**.
   - The result of **GET getAlleActieverzoeken** must be stored in an operaton process variable named **"
      actieverzoeken"**.

4. **Example Process Flow**
    - Start the process.
   - Add an **operaton service task** and select the **GET getActieverzoek** or **GET getAlleActieverzoeken** action.
   - Map the result to the respective operaton process variable (**actieverzoek** or **actieverzoeken**).
    - Proceed with the rest of the process logic using the stored data.


#### Tabblad Config

Onder `config/case/[...]/case/tab/[...].case-tab.json` kan het tabblad worden gekoppeld aan het dossier

```json
{
  "changesetId": "samenwerkingfunctionaliteit.case-tabs.1768982327099",
  "case-definitions": [
    {
      "key": "samenwerkingfunctionaliteit",
      "tabs": [
        {
          "key": "documentenlijstwidget",
          "name": "Documentenlijst",
          "type": "custom",
          "contentKey": "documentenlijst-widget-tab"
        },
        {
          "key": "notificatiestab",
          "name": "Notificaties",
          "type": "custom",
          "contentKey": "notificaties-custom-tab"
        },
        {
          "key": "berichtentab",
          "name": "Berichten",
          "type": "custom",
          "contentKey": "berichten-custom-tab"
        },
        {
          "key": "samenwerkingwidget",
          "name": "Samenwerking",
          "type": "custom",
          "contentKey": "samenwerking-widget-tab"
        }
      ]
    }
  ]
}
```

_Zie [toevoegen van plugins](https://docs.valtimo.nl/features/plugins/plugins/custom-plugin-definition#adding-the-plugin-module-to-the-ngmodule)
en [toevoegen van case tabs](https://docs.valtimo.nl/features/case/for-developers/case-tabs) in de Valtimo docs._

1. **Configure the Plugin**
   Set the `baseUrl` property in the plugin configuration to the base URL of your API.

2. **Add Actions to Operaton Service Tasks**
   - For retrieving a single **actieverzoek**, use the **GET getActieverzoek** action in an operaton service task.
   - For retrieving all **actieverzoeken**, use the **GET getAlleActieverzoeken** action in an operaton service task.
   - Set the **isOrganisationTheReceiver** variable to true or false, depending on whether you would like to receive all actieverzoeken based on if your organisation is the receiver. This variable defaults to true.

3. **Store the Results**
   - The result of **GET getActieverzoek** must be stored in an operaton process variable named **"actieverzoek"**.
   - The result of **GET getAlleActieverzoeken** must be stored in an operaton process variable named **"
     actieverzoeken"**.

4. **Example Process Flow**
   - Start the process.
   - Add an **operaton service task** and select the **GET getActieverzoek** or **GET getAlleActieverzoeken** action.
   - Map the result to the respective operaton process variable (**actieverzoek** or **actieverzoeken**).
   - Proceed with the rest of the process logic using the stored data.

