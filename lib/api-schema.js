'use strict';

const fs = require('fs');
const YAML = require('yamljs');

class ApiSchema {

	get pathParameters() {
		return this._pathParameters;
	}

	set pathParameters(pathParameters) {
		this._pathParameters = pathParameters;
	}

	get schemaPath() {
		return `./view-schemas/${this.pathParameters.entity}/${this.pathParameters.action}.yml`;
	}

	validate() {
		return this.fileExists(this.schemaPath);
	}

	async process() {

		try {

			const schema = YAML.load(this.schemaPath);

			return { body: schema };

		} catch(e) {

			return {
				code: 500,
				body: {
					message: 'Invalid schema'
				}
			};
		}
	}

	fileExists(filePath) {

		return new Promise((resolve, reject) => {
			fs.access(filePath, err => {

				if(err)
					return reject(new Error('Schema not found'));

				resolve();
			});
		});
	}

}

module.exports = ApiSchema;
