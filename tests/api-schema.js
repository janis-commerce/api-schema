'use strict';

const assert = require('assert');
const sinon = require('sinon');

const fs = require('fs');
const YAML = require('yamljs');

const { ApiSchema } = require('../');

const sandbox = sinon.createSandbox();

/* eslint-disable prefer-arrow-callback */

describe('Schema API', function() {

	afterEach(() => {
		sandbox.restore();
	});

	describe('validate', function() {

		it('Should reject if the schema doesn\'t exist', async function() {

			const fsAccessStub = sandbox.stub(fs, 'access');
			fsAccessStub.callsFake((filePath, callback) => callback(new Error()));
			const schemaApi = new ApiSchema();
			schemaApi.pathParameters = {
				entity: 'someEntity',
				action: 'someAction'
			};

			await assert.rejects(() => schemaApi.validate());

			sinon.assert.calledOnce(fsAccessStub);
			sinon.assert.calledWith(fsAccessStub, './view-schemas/someEntity/someAction.yml');
		});

		it('Should resolve if the schema exists', async function() {

			const fsAccessStub = sandbox.stub(fs, 'access');
			fsAccessStub.callsFake((filePath, callback) => callback());
			const schemaApi = new ApiSchema();
			schemaApi.pathParameters = {
				entity: 'someEntity',
				action: 'someAction'
			};

			const validationResult = await schemaApi.validate();

			assert.strictEqual(validationResult, undefined);

			sinon.assert.calledOnce(fsAccessStub);
			sinon.assert.calledWith(fsAccessStub, './view-schemas/someEntity/someAction.yml', sinon.match.func);
		});

	});

	describe('process', function() {

		it('Should return a 500 if schema is not a valid yaml', async function() {

			const yamlLoadStub = sandbox.stub(YAML, 'load');
			yamlLoadStub.throws(new Error('Some fake error'));

			const schemaApi = new ApiSchema();
			schemaApi.pathParameters = {
				entity: 'someEntity',
				action: 'someAction'
			};
			const response = await schemaApi.process();

			assert.deepStrictEqual(response, {
				code: 500,
				body: {
					message: 'Invalid schema'
				}
			});
		});

		it('Should return a 200 if schema is a valid yaml', async function() {

			const schema = { im: 'a', schema: 'dude' };

			const yamlLoadStub = sandbox.stub(YAML, 'load');
			yamlLoadStub.returns(schema);

			const schemaApi = new ApiSchema();
			schemaApi.pathParameters = {
				entity: 'someEntity',
				action: 'someAction'
			};
			const response = await schemaApi.process();

			assert.deepStrictEqual(response, { body: schema });
		});

	});

});
