import Ajv from "ajv";
import { PhoneFeatureValue } from "../model";

interface IAddPhone {
    title: string;
    description: string;
    price: number;
    categoryId?: number;
    features: PhoneFeatureValue[];
}

interface IUploadedPhoto {
    imagePath: string;
}

const ajv = new Ajv();

const IAddPhoneValidator = ajv.compile({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 2,
            maxLength: 128,
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 64 * 1024,
        },
        price: {
            type: "number",
            minimum: 0.01,
            multipleOf: 0.01,
        },
        categoryId: {
            type: "integer",
            minimum: 1,
        },
        features: {
            type: "array",
            minItems: 0,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    featureId: {
                        type: "number",
                        minimum: 1,
                    },
                    value: {
                        type: "string",
                        minLength: 1,
                        maxLength: 64,
                    }
                },
                required: [ "featureId", "value" ],
                additionalProperties: false,
            },
        },
    },
    required: [ "title", "description", "price", "features" ],
    additionalProperties: false,
});

export { IAddPhone };
export { IAddPhoneValidator };
export { IUploadedPhoto };
