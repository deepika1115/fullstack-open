```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 Created<br/>{"message":"note created"}
    deactivate server

    Note right of browser: The browser updates the notes list dynamically (SPA, without reload)