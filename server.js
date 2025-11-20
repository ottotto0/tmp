import express from "express";
import dotenv from "dotenv";
import { Client } from "@gradio/client";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const client = await Client.connect(
      "Nech-C/waiNSFWIllustrious_v140",
      { hf_token: process.env.HUGGINGFACE_TOKEN }
    );

    const result = await client.predict("/infer", {
      model: "v150",
      prompt,
      quality_prompt: prompt,
      negative_prompt: "",
      seed: 0,
      randomize_seed: true,
      width: 768,
      height: 768,
      guidance_scale: 7,
      num_inference_steps: 25,
      num_images: 1,
      use_quality: true
    });

    res.json({ image: result.data[0].image.url });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log("http://localhost:3000"));
