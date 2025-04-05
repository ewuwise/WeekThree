const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

async function convertModelAndPredict() {

  const modelPath = path.join(__dirname, 'models', 'model.h5');
  const model = await tf.loadLayersModel(`file://${modelPath}`);
  
  // Save the model in TensorFlow.js format
  await model.save('file://./models/model.json');
  console.log('Model converted and saved to TensorFlow.js format');
    // Function to make predictions based on input data
    async function makePrediction(inputData) {
        const inputTensor = tf.tensor2d([inputData]);
        const prediction = model.predict(inputTensor);
        return prediction.dataSync();
    }

    // Example usage of makePrediction
    const exampleInput = [/* input data here */];
    const predictionResult = await makePrediction(exampleInput);
    console.log('Prediction result:', predictionResult);
}


convertModel().catch(err => {
  console.error('Error during model conversion:', err);
});
