// test-model.js
import { pipeline } from '@huggingface/transformers';

async function testModel() {
  try {
    console.log('Starting model initialization...');
    const classifier = await pipeline(
      'image-classification',
      'Xenova/quickdraw-mobilevit-small'
    );
    console.log('Model loaded successfully!');
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

testModel();