import express from "express";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

console.log("process.cwd()", process.cwd());

const app = express();
const PORT = 3000;
const TWITCH_URL = "rtmp://hel.contribute.live-video.net/app/";
const YOUTUBE_URL = "rtmp://a.rtmp.youtube.com/live2/";
const KEY = process.env.KEY;

function createStream() {
  const video = path.join(process.cwd(), "source", "./video.mp4");
  const audio = path.join(process.cwd(), "source", "./audio.mp3");

  ffmpeg()
    .addInput(video)
    .addInput(audio)
    .addOption("-map", "0:v")
    .addOption("-map", "1:a")
    .addOption("-c:v", "copy")
    .addOption("-vcodec", "libx264")
    .addOption("-acodec", "aac")
    // .addOption("-b:v", "5M")
    // .addOption("-b:a", "256k")
    .addOption("-crf", "26")
    .addOption("-aspect", "1280:720")
    .addOption("-f", "flv")
    .withSize("1280x720")
    .on("start", (commandLine: string) => {
      console.log("Query : ", commandLine);
    })
    .on("error", (err: Error) => {
      console.log("Error: " + err.message);
    })
    .output(TWITCH_URL + KEY)
    .run();
}

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
  createStream();
});
