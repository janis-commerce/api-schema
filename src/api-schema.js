'use strict';

const fs = require('fs');
const YAML = require('yamljs');

class ApiSchema {

	constructor(entity, action) {
		this.entity = entity;
		this.action = action;
	}

	get schemaPath() {
		return `./view-schemas/${this.entity}/${this.action}.yml`;
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
