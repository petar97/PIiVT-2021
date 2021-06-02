import Ajv from "ajv";
import { PhoneFeatureValue } from "../model";

interface IEditPhone {
    title: string;
    description: string;
    price: number;
    features: PhoneFeatureValue[];
}

const ajv = new Ajv();

const IEditPhoneValidator = ajv.compile({
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

export { IEditPhone };
export { IEditPhoneValidator };
