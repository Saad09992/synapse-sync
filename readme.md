# Introduction

A Sync Engine that lets offline applications reconcile their changes, with a server with conflict awareness and resolution decided by the application.

## Why

When 2 or more applications try to update the same data on the server every application can overwrite the previous applications update without any trace or accountability. A Sync Engine introduces accountability and traces the changelogs done by multiple applications.

## How it works

Suppose 2 applications start with same base v3 and both edit the same document while being offline now both applications will have their own version of the same document. When 1 application goes online and syncs their version of the document to the server the document is saved on the server with **version** v3 is incremented to v4. Now when the second application goes online and tries to sync the engine detects the outdated document and tells the application that its document is outdated and also provide a copy of the latest document from the server.The application then decides whether to keep its own version or the server's. After deciding the application then sends a resolve request to the server. If the application decided that the applications document should overwrite the servers document then the version of document is incremented on the server and a changelog is created with the resolution type. and if it chooses the latter then the version is kept as it is on the server but the changelog is created for this scnerio as well.
