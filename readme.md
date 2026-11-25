# How it will work

This is the server side logic implementation
The client will be handled by the frontend/client side
for now we will use postman as a client

right now the sync endpoint returns outdated if the clients version is not in sync with the latest/server version

see it returns the latest_version as well not the clients job is to use the received latest_version and compare it to its outdated version of the document and come to an agreement with the server either overwrite the server version and the client_wins and either accept the server_version and the server_wins lets implement an endpoint for that

lets see what payload we will need i think

client_id
document_id
clients_version
resolution_type
document: Document
"description":"this is a update for document 2"

Document {
"title":"Updated Title feld 2 ",
"content":"Updated Content field 2",
"version":4,
"updated_at": EpochTimeStamp
}

lets implement it as we go see if we need anything else

alright so how this will work lets implement

Lets end session here 1hr 11mins i know my pace is slow but ai have roasted my brain see you
