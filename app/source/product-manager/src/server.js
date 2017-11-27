'use strict';
const newrelic = require('newrelic');

//  Express
const express = require('express');
const bodyParser = require('body-parser');

// UUID Generator Module
const uuidV4 = require('uuid/v4');

// Configure Environment
const configModule = require('../shared-modules/config-helper/config.js');
var configuration = configModule.configure(process.env.NODE_ENV);

// Configure Logging
const winston = require('winston');
winston.level = configuration.loglevel;

// Include Custom Modules
const tokenManager = require('../shared-modules/token-manager/token-manager.js');
const DynamoDBHelper = require('../shared-modules/dynamodb-helper/dynamodb-helper.js');

// Instantiate application
var app = express();
//Get hostname
var hostname = tokenManager.getOS();var bearerToken = '';
var tenant_id = '';
var claims = {};
var session_id = '';
var nrclaims = {};
// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    bearerToken = req.get('Authorization');
    if (bearerToken) {
        tenant_id = tokenManager.getTenantId(req);
    }
    if (bearerToken) {
        claims = tokenManager.decodeToken(bearerToken);
    }
    if (bearerToken) {
        session_id = tokenManager.getSessionID(req);
    }
    if (bearerToken) {
        nrclaims = tokenManager.getNRClaims(req);
    }
    if (hostname) {
        newrelic.addCustomParameter('req_host', hostname);
    }
    next();
});

// Create a schema
var productSchema = {
    TableName : configuration.table.product,
    KeySchema: [
        { AttributeName: "tenant_id", KeyType: "HASH"},  //Partition key
        { AttributeName: "productId", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "tenant_id", AttributeType: "S" },
        { AttributeName: "productId", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

app.get('/product/health', function(req, res) {
    res.status(200).send({service: 'Product Manager', isAlive: true});
});

// Create REST entry points
app.get('/product/:id', function(req, res) {
    winston.debug('Fetching product: ' + req.params.id);

    tokenManager.getCredentialsFromToken(req, function(credentials) {
        // init params structure with request params
        var params = {
            tenant_id: tenant_id,
            productId: req.params.id
        }

        // construct the helper object
        var dynamoHelper = new DynamoDBHelper(productSchema, credentials, configuration);

        dynamoHelper.getItem(params, credentials, function (err, product) {
            if (err) {
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(params);
                newrelic.noticeError(err.message, nrclaims);
                winston.error('Error getting product: ' + err.message);
                res.status(400).send('{"Error" : "Error getting product"}');
            }
            else {
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(product);
                winston.debug('Product ' + req.params.id + ' retrieved');
                res.status(200).send(product);
            }
        });
    });
});

app.get('/products', function(req, res) {
    winston.debug('Fetching Products for Tenant Id: ' + tenant_id);
    tokenManager.getCredentialsFromToken(req, function(credentials) {
        var searchParams = {
            TableName: productSchema.TableName,
            KeyConditionExpression: "tenant_id = :tenant_id",
            ExpressionAttributeValues: {
                ":tenant_id": tenant_id
            }
        };

        // construct the helper object
        var dynamoHelper = new DynamoDBHelper(productSchema, credentials, configuration);

        dynamoHelper.query(searchParams, credentials, function (error, products) {
            if (error) {
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(searchParams);
                newrelic.noticeError(error.message, nrclaims);
                winston.error('Error retrieving products: ' + error.message);
                res.status(400).send('{"Error" : "Error retrieving products"}');
            }
            else {
                winston.debug('Products successfully retrieved');
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(products);
                res.status(200).send(products);
            }

        });
    });
});

app.post('/product', function(req, res) {
    tokenManager.getCredentialsFromToken(req, function(credentials) {
        var product = req.body;
        product.productId = uuidV4();
        product.tenant_id = tenant_id;

        // construct the helper object
        var dynamoHelper = new DynamoDBHelper(productSchema, credentials, configuration);

        dynamoHelper.putItem(product, credentials, function (err, product) {
            if (err) {
                winston.error('Error creating new product: ' + err.message);
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(req.body);
                newrelic.noticeError(err.message, nrclaims);
                res.status(400).send('{"Error" : "Error creating product"}');
            }
            else {
                winston.debug('Product ' + req.body.title + ' created');
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(product);
                res.status(200).send({status: 'success'});
            }
        });
    });
});

app.put('/product', function(req, res) {
    winston.debug('Updating product: ' + req.body.productId);
    tokenManager.getCredentialsFromToken(req, function(credentials) {
        // init the params from the request data
        var keyParams = {
            tenant_id: tenant_id,
            productId: req.body.productId
        }

        winston.debug('Updating product: ' + req.body.productId);

        var productUpdateParams = {
            TableName: productSchema.TableName,
            Key: keyParams,
            UpdateExpression: "set " +
                "sku=:sku, " +
                "title=:title, " +
                "description=:description, " +
                "#condition=:condition, " +
                "conditionDescription=:conditionDescription, " +
                "numberInStock=:numberInStock, " +
                "unitCost=:unitCost",
            ExpressionAttributeNames: {
                '#condition' : 'condition'
            },
            ExpressionAttributeValues: {
                ":sku": req.body.sku,
                ":title": req.body.title,
                ":description": req.body.description,
                ":condition":req.body.condition,
                ":conditionDescription":req.body.conditionDescription,
                ":numberInStock":req.body.numberInStock,
                ":unitCost":req.body.unitCost
            },
            ReturnValues:"UPDATED_NEW"
        };

        // construct the helper object
        var dynamoHelper = new DynamoDBHelper(productSchema, credentials, configuration);

        dynamoHelper.updateItem(productUpdateParams, credentials, function (err, product) {
            if (err) {
                winston.error('Error updating product: ' + err.message);
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(req.body);
                newrelic.noticeError(err.message, nrclaims);
                res.status(400).send('{"Error" : "Error updating product"}');
            }
            else {
                winston.debug('Product ' + req.body.title + ' updated');
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(product);
                res.status(200).send(product);
            }
        });
    });
});

app.delete('/product/:id', function(req, res) {
    winston.debug('Deleting product: ' + req.params.id);

    tokenManager.getCredentialsFromToken(req, function(credentials) {
        // init parameter structure
        var deleteProductParams = {
            TableName : productSchema.TableName,
            Key: {
                tenant_id: tenant_id,
                productId: req.params.id
            }
        };

        // construct the helper object
        var dynamoHelper = new DynamoDBHelper(productSchema, credentials, configuration);

        dynamoHelper.deleteItem(deleteProductParams, credentials, function (err, product) {
            if (err) {
                winston.error('Error deleting product: ' + err.message);
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(deleteProductParams.Key);
                newrelic.noticeError(err.message, nrclaims);
                res.status(400).send('{"Error" : "Error deleting product"}');
            }
            else {
                winston.debug('Product ' + req.params.id + ' deleted');
                newrelic.addCustomParameter('session_id', session_id);
                newrelic.addCustomParameters(nrclaims);
                newrelic.addCustomParameters(product);
                res.status(200).send({status: 'success'});
            }
        });
    });
});




// Start the servers
app.listen(configuration.port.product);
console.log(configuration.name.product + ' service started on port ' + configuration.port.product);
