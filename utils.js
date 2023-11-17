function multiplyMatrices(matrixA, matrixB) {
    var result = [];

    for (var i = 0; i < 4; i++) {
        result[i] = [];
        for (var j = 0; j < 4; j++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += matrixA[i * 4 + k] * matrixB[k * 4 + j];
            }
            result[i][j] = sum;
        }
    }

    // Flatten the result array
    return result.reduce((a, b) => a.concat(b), []);
}
function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
function createScaleMatrix(scale_x, scale_y, scale_z) {
    return new Float32Array([
        scale_x, 0, 0, 0,
        0, scale_y, 0, 0,
        0, 0, scale_z, 0,
        0, 0, 0, 1
    ]);
}

function createTranslationMatrix(x_amount, y_amount, z_amount) {
    return new Float32Array([
        1, 0, 0, x_amount,
        0, 1, 0, y_amount,
        0, 0, 1, z_amount,
        0, 0, 0, 1
    ]);
}

function createRotationMatrix_Z(radian) {
    return new Float32Array([
        Math.cos(radian), -Math.sin(radian), 0, 0,
        Math.sin(radian), Math.cos(radian), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_X(radian) {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(radian), -Math.sin(radian), 0,
        0, Math.sin(radian), Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_Y(radian) {
    return new Float32Array([
        Math.cos(radian), 0, Math.sin(radian), 0,
        0, 1, 0, 0,
        -Math.sin(radian), 0, Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function getTransposeMatrix(matrix) {
    return new Float32Array([
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ]);
}

const vertexShaderSource = `
attribute vec3 position;
attribute vec3 normal; // Normal vector for lighting

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vNormal = vec3(normalMatrix * vec4(normal, 0.0));
    vLightDirection = lightDirection;

    gl_Position = vec4(position, 1.0) * projectionMatrix * modelViewMatrix; 
}

`

const fragmentShaderSource = `
precision mediump float;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vLightDirection);
    
    // Ambient component
    vec3 ambient = ambientColor;

    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseColor;

    // Specular component (view-dependent)
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming the view direction is along the z-axis
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularColor;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}

`

/**
 * @WARNING DO NOT CHANGE ANYTHING ABOVE THIS LINE
 */



/**
 * 
 * @TASK1 Calculate the model view matrix by using the chatGPT
 */

function getChatGPTModelViewMatrix() {
    const transformationMatrix = new Float32Array([
        // you should paste the response of the chatGPT here:
       
            0.612372, -0.353553, 0.707107, 0.3,
            0.612372, 0.353553, -0.707107, -0.25,
            -0.5, 0.707107, 0.5, 0,
            0, 0, 0, 1,
 
    ]);
    return getTransposeMatrix(transformationMatrix);
}

/**
 * 
 * @TASK2 Calculate the model view matrix by using the given 
 * transformation methods and required transformation parameters
 * stated in transformation-prompt.txt
 */
function getModelViewMatrix() {
    // Define transformation parameters
    const translation = { x: 0.3, y: -0.25, z: 0 };
    const scaling = { x: 0.5, y: 0.5, z: 1 };
    const rotation = { x: 30, y: 45, z: 60 }; // degrees

    // Translation matrix
    function translate(tx, ty, tz) {
        return [
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        ];
    }

    // Scaling matrix
    function scale(sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ];
    }

    // Rotation matrices
    function rotateX(angle) {
        const rad = angle * Math.PI / 180;
        return [
            1, 0, 0, 0,
            0, Math.cos(rad), -Math.sin(rad), 0,
            0, Math.sin(rad), Math.cos(rad), 0,
            0, 0, 0, 1
        ];
    }

    function rotateY(angle) {
        const rad = angle * Math.PI / 180;
        return [
            Math.cos(rad), 0, Math.sin(rad), 0,
            0, 1, 0, 0,
            -Math.sin(rad), 0, Math.cos(rad), 0,
            0, 0, 0, 1
        ];
    }

    function rotateZ(angle) {
        const rad = angle * Math.PI / 180;
        return [
            Math.cos(rad), -Math.sin(rad), 0, 0,
            Math.sin(rad), Math.cos(rad), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    // Matrix multiplication function
    function multiplyMatrices(matrixA, matrixB) {
        const result = new Array(16).fill(0);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                for (let i = 0; i < 4; i++) {
                    result[row * 4 + col] += matrixA[row * 4 + i] * matrixB[i * 4 + col];
                }
            }
        }
        return result;
    }

    // Combine transformations
    let modelViewMatrix = translate(translation.x, translation.y, translation.z);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, scale(scaling.x, scaling.y, scaling.z));
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotateX(rotation.x));
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotateY(rotation.y));
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotateZ(rotation.z));

    return modelViewMatrix;
}


/**
 * 
 * @TASK3 Ask CHAT-GPT to animate the transformation calculated in 
 * task2 infinitely with a period of 10 seconds. 
 * First 5 seconds, the cube should transform from its initial 
 * position to the target position.
 * The next 5 seconds, the cube should return to its initial position.
 */

function getPeriodicMovement(startTime) {
    const elapsedSeconds = (Date.now() - startTime) / 1000; // Convert milliseconds to seconds
    const animationPeriod = 100; // Total duration of the animation in seconds
    const halfPeriod = animationPeriod / 2; // Half of the animation period

    // Calculate the progress within one animation period (0 to 1)
    const progress = (elapsedSeconds % animationPeriod) / animationPeriod;

    // If in the first half of the period, animate from initial to target position
    if (elapsedSeconds < halfPeriod) {
        const targetTranslation = { x: 0.3, y: -0.25, z: 0 };
        const targetRotation = { x: 30, y: 45, z: 60 };

        // Interpolate translation and rotation based on progress
        const interpolatedTranslation = {
            x: lerp(0, targetTranslation.x, progress),
            y: lerp(0, targetTranslation.y, progress),
            z: lerp(0, targetTranslation.z, progress)
        };

        const interpolatedRotation = {
            x: lerp(0, targetRotation.x, progress),
            y: lerp(0, targetRotation.y, progress),
            z: lerp(0, targetRotation.z, progress)
        };

        // Calculate the model view matrix using the interpolated translation and rotation
        return getModelViewMatrixWithParams(interpolatedTranslation, { x: 1, y: 1, z: 1 }, interpolatedRotation);
    } else {
        // In the second half of the period, animate back to the initial position
        const reversedProgress = (elapsedSeconds % halfPeriod) / halfPeriod;

        // Interpolate translation and rotation back to initial values
        const interpolatedTranslation = {
            x: lerp(0.3, 0, reversedProgress),
            y: lerp(-0.25, 0, reversedProgress),
            z: lerp(0, 0, reversedProgress)
        };

        const interpolatedRotation = {
            x: lerp(30, 0, reversedProgress),
            y: lerp(45, 0, reversedProgress),
            z: lerp(60, 0, reversedProgress)
        };

        // Calculate the model view matrix using the interpolated translation and rotation
        return getModelViewMatrixWithParams(interpolatedTranslation, { x: 1, y: 1, z: 1 }, interpolatedRotation);
    }
}

// Linear interpolation function
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// Calculate the model view matrix with specified translation, scaling, and rotation
function getModelViewMatrixWithParams(translation, scaling, rotation) {
    const translationMatrix = createTranslationMatrix(translation.x, translation.y, translation.z);
    const scalingMatrix = createScaleMatrix(scaling.x, scaling.y, scaling.z);
    const rotationMatrixX = createRotationMatrix_X(rotation.x);
    const rotationMatrixY = createRotationMatrix_Y(rotation.y);
    const rotationMatrixZ = createRotationMatrix_Z(rotation.z);

    // Combine transformations
    let modelViewMatrix = multiplyMatrices(translationMatrix, scalingMatrix);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationMatrixX);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationMatrixY);
    modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationMatrixZ);

    return modelViewMatrix;
}
