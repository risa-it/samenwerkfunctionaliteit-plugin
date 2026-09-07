# Plugin Documentation

<!-- Use this page to document your plugin. Below is a suggested structure. -->

## Overview

This is a sample plugin demonstrating an API call action. It fetches data from a time API endpoint.

## Dependencies

### Backend

```kotlin
dependencies {
    implementation("com.ritense.valtimoplugins:samenwerkfunctionaliteit-plugin:0.2.0")
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

## Frontend configuration

### Uploading files within the Samenwerkingsfunctionaliteit API
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

### Actieverzoek polling service
This plugin supplies a service that polls for new actieverzoeken in the Samenwerkfunctionaliteit API. When a new actieverzoek is created, the plugin automatically generates a new 'Actieverzoek Samenwerkfunctionaliteit' object in the Objecten API.

To enable this feature, the following steps should be taken:

1. Create an object type in the Objecten API. It should have the following JSON schema:
```json
{
  "$id": "actieverzoek-samenwerkfunctionaliteit-[your-project-name].schema",
  "type": "object",
  "title": "Actieverzoek Samenwerkfunctionaliteit [Your Project Name]",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "properties": {
    "kvk": {
      "type": "string"
    },
    "data": {
      "type": "object",
      "properties": {
        "samenwerkingProperties": {
          "type": "object",
          "properties": {
            "actieverzoekId": {
              "type": "string"
            },
            "samenwerkingId": {
              "type": "string"
            },
            "actieverzoekDetails": {
              "type": "object",
              "properties": {
                "deelnemer": {
                  "type": "string"
                },
                "eventDatumTijd": {
                  "type": "string"
                },
                "eventInitiator": {
                  "type": "string"
                }
              }
            }
          }
        },
        "isAutomatischGegenereerd": {
          "type": "boolean",
          "default": false
        }
      }
    },
    "type": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
``` 

2. Add the following configuration to your application.yaml to automatically generate an actieverzoek object:

```yaml
samenwerkfunctionaliteit:
    actieverzoek-notificaties:
        enabled: true
        # The UUID of the object type registered in the preceding step
        object-type-uuid: ${THE_UUID_OF_YOUR_ACTIEVERZOEK_SAMENWERKFUNCTIONALITEIT_OBJECT}
        # The OIN of the organisation which is envolved in the actieverzoek (requesting or receiving party)
        organisatie-oin: ${SAMENWERKFUNCTIONALITEIT_ACTIEVERZOEK_NOTIFICATIES_ORGANISATIE_OIN}
        # The base URL the Samenwerkfunctionaliteit API
        swf-api-base-url: ${SAMENWERKFUNCTIONALITEIT_API_BASE_URL}
        # The earliest creation datetime of actieverzoeken that should be transformed into a case
        initial-event-date-time: ${SAMENWERKFUNCTIONALITEIT_ACTIEVERZOEK_NOTIFICATIES_INITIAL_EVENT_DATUM_TIJD}
```

3. Add an object management configuration referring to this object type in config/objectmanagement/:
```json
{
    "id": "ee4f6d46-ca31-45cf-b601-990c0e5e3cab",
    "title": "Actieverzoek Samenwerkfunctionaliteit",
    "objecttypenApiPluginConfigurationId": "bc109d5e-0388-4637-bcfa-b454f402bef8",
    "objecttypeId": "${THE_UUID_OF_YOUR_ACTIEVERZOEK_SAMENWERKFUNCTIONALITEIT_OBJECT}",
    "objecttypeVersion": "${THE_VERSION_NUMBER_OF_YOUR_ACTIEVERZOEK_SAMENWERKFUNCTIONALITEIT_OBJECT}",
    "objectenApiPluginConfigurationId": "a1a5e464-92db-41fc-9ab9-da663dd18471",
    "showInDataMenu": false,
    "formDefinitionView": "",
    "formDefinitionEdit": ""
}
```

4. To listen for new objects being created (whenever a new actieverzoek is added to the Samenwerkfunctionaliteit API), add the following Verzoeken plugin configuration:

```json
[
    {
        "id": "[a freshly-generated UUID]",
        "title": "Verzoek [Your Process' Name] SWF (Autodeployed)",
        "pluginDefinitionKey": "verzoek",
        "properties": {
            "notificatiesApiPluginConfiguration": "[the uuid of of your Notificaties API configuration]",
            // starts the generic create-zaakdossier process
            "processToStart": "create-zaakdossier",
            "rsin": "${RSIN_OF_YOUR_ORGANISATION}",
            "verzoekProperties": [
                {
                    "type": "Verzoek GGD SWF",
                    "initiatorRolDescription": "${INITIATOR_ROLE_DESCRIPTION_URL_OF_YOUR_CASE}",
                    "caseDefinitionKey": "ggd-haaglanden-advisering-leefomgeving",
                    // This is the UUID of the object management, created above
                    "objectManagementId": "ee4f6d46-ca31-45cf-b601-990c0e5e3cab", 
                    "initiatorRoltypeUrl": "${INITIATOR_ROLE_TYPE_URL_OF_YOUR_CASE}",
                    "processDefinitionKey": "[the-process-definition-key-for-your-case]",
                    "copyStrategy": "specified",
                    "mapping": [
                        {
                            "source": "/samenwerkingProperties/actieverzoekDetails/deelnemer",
                            "target": "doc:/samenwerkingProperties/actieverzoekDetails/deelnemer"
                        },
                        {
                            "source": "/samenwerkingProperties/actieverzoekDetails/eventDatumTijd",
                            "target": "doc:/samenwerkingProperties/actieverzoekDetails/eventDatumTijd"
                        },
                        {
                            "source": "/samenwerkingProperties/actieverzoekDetails/eventInitiator",
                            "target": "doc:/samenwerkingProperties/actieverzoekDetails/eventInitiator"
                        },
                        {
                            "source": "/samenwerkingProperties/actieverzoekDetails/actieverzoekId",
                            "target": "doc:/samenwerkingProperties/actieverzoekDetails/actieverzoekId"
                        },
                        {
                            "source": "/isAutomatischGegenereerd",
                            "target": "doc:/isAutomaticallyGenerated"
                        },
                        {
                            "source": "/samenwerkingProperties/samenwerkingId",
                            "target": "doc:/samenwerkingProperties/samenwerkingId"
                        }
                    ]
                }
            ]
        }
    }
]
```

That's it. This configuration should generate a new case whenever the service detects that a new actieverzoek intended for your organisation has been created in the Samenwerkfunctionaliteit API.

## Plugin actions

### Time API test action

Sends a GET request to the configured API URL and returns the timezone response.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
|           |      |          |             |

### GET `getActieverzoek`

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

### GET `getAlleActieverzoeken`

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

### GET `getSamenwerkingenNotificaties`

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