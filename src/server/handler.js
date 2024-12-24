import InputError from '../error/InputError.js';
import predictBinaryClassificationCancer from '../services/inferenceService.js';
import storeData from '../services/storeData.js';
import loadHistoryData from '../services/loadHistoryData.js';
import crypto from 'crypto';

const postPredictHandler = async (request, h) => {
  try {
    const { model } = request.server.app;
    const { image } = request.payload;

    // Debugging: Log the image to check if it's valid
    console.log("Received image for prediction:", image);

    // Perform the prediction
    const { confidenceScore, label, suggestion } =
      await predictBinaryClassificationCancer(model, image);

    // Debugging: Log the prediction result
    console.log("Prediction result:", { confidenceScore, label, suggestion });

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    // Optionally, store the prediction data (uncomment if needed)
    // await storeData(id, data);

    return h
      .response({
        status: 'success',
        message:
          confidenceScore >= 100 || confidenceScore < 1
            ? 'Model is predicted successfully'
            : 'Model is predicted successfully but under threshold. Please use the correct picture',
        data,
      })
      .code(201);
  } catch (error) {
    // Log the error for debugging
    console.error("Error during prediction:", error);

    // Throw custom error
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi', 400);
  }
};

const getPredictHistoryHandler = async (request, h) => {
  try {
    const { data } = await loadHistoryData();

    return h
      .response({
        status: 'success',
        data,
      })
      .code(200);
  } catch (error) {
    // Log the error for debugging
    console.error("Error while loading history data:", error);

    // Throw custom error
    throw new InputError('Terjadi kesalahan dalam mengambil data riwayat', 400);
  }
};

const NotFoundHandler = (request, h) =>
  h
    .response({
      status: 'fail',
      message: 'Halaman tidak ditemukan',
    })
    .code(404);

export { postPredictHandler, NotFoundHandler, getPredictHistoryHandler };
