const { Groq } = require('groq');
const { LLaMA } = require('huggingface/transformers');

async function main() {
  const groq = new Groq();
  console.log('Groq API installed:', await groq.getVersion());

  const llama = new LLaMA('facebook/LLaMA', 'llama-base-90b-vision');
  console.log('LLaMA 3.2-90B-Vision model installed:', await llama.isReady());
}

main();
```