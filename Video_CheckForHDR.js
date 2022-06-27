/**
 * Check if video uses HDR
 * Needs `ffprobe` tool and assumes that the input is a video file
 * @author GamerBene19
 * @version 0.1
 * @output HDR detected
 * @output No HDR detected
 */
function Script() {
  const ffprobe = Flow.GetToolPath("ffprobe");
  // If ffprobe could not be found fail flow/script
  if (!ffprobe) {
    Logger.ELog("ffprobe not found!");
    return -1;
  }

  const proc = Flow.Execute({
    command: ffprobe,
    argumentList: [
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_streams",
      "-select_streams",
      "v:0",
      "file:" + Variables.file.FullName,
    ],
  });
  const parsed = JSON.parse(proc.standardOutput);

  // If the output could not be parsed fail flow/script
  if (!parsed) {
    Logger.ELog("Could not parse ffprobe output!");
    return -1;
  }

  // As per https://video.stackexchange.com/a/33827 a file has HDR if it uses `arib-std-b67` or `smpte2084` for color transfer
  const colTrans = parsed.streams[0].color_transfer;
  Logger.ILog("col_transfer is: " + colTrans);
  return colTrans === "arib-std-b67" || colTrans === "smpte2084" ? 1 : 2;
}
