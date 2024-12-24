import tf from '@tensorflow/tfjs-node';

const loadModel = async () => {
  const modelUrl = process.env.MODEL_URL || 'https://storage.googleapis.com/model-emel/model.json';
  return await tf.loadGraphModel(modelUrl);
};

export default loadModel;
