# API Schema

[![Build Status](https://travis-ci.org/janis-commerce/api-schema.svg?branch=master)](https://travis-ci.org/janis-commerce/api-schema)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/api-schema/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/api-schema?branch=master)

A package to handle JANIS Views Schema APIs

## Installation

```
npm install @janiscommerce/api-schema
```

## Usage

```js
'use strict';

const { ApiSchema } = require('@janiscommerce/api-schema');

(async () => {

	const apiSchema = new ApiSchema();

	apiSchema.pathParameters = {
		entity: 'someEntity',
		action: 'someAction'
	};

	await apiSchema.validate();

	const response = ApiSchema.process();

})();
```