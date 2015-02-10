var http = require('http');
var internalIp = require('internal-ip');
var Transcoder = require('stream-transcoder');
var grabOpts = require('../utils/grab-opts');
var url = require('url');
var port = 4103;


var transcode = function(res,path,startTime,endTime,bitRate,playlist) {
  var ip = internalIp();
  //http.createServer(function(req, res) {

    ctx = {};
    ctx.options = {};
    ctx.options.playlist = [];
    ctx.options.playlist[0] = {path : path
      //'https://api-prod02-s.whipclip.com/v1/media/video/types/hls.m3u8?mediaContext=a.dXNfbGlmZXRpbWV8MTQyMzE5NDc5MjQwMHwxNDIzMTk0ODA0NDAwfDE0MjMyNDExMzQzNzg.9a8b24b62b1ca77e804733288b4539c418b041ecd3789437b98b252f5ddac5ca&startOffset=0&endOffset=12000&deviceId=cUeCtyDpdESSpeONtHL2'
      //'http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8',
      //'https://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8'
      //'http://nv-se01.se.c04cp.vds-is.castup.net/vod/_definst_/smil:server12/31/900/90048692-149.smil/playlist.m3u8?wowzasessionid=0&device=iphone&ct=IL&rg=BZ&aid=31&ts=0&cu=ACFFA8D7-3B4A-480C-A647-D61A99505EF5'
    };
    //var orgPath = 'https://api-prod02-s.whipclip.com/v1/media/video/types/hls.m3u8?mediaContext=a.dXNfbGlmZXRpbWV8MTQyMzE5NDc5MjQwMHwxNDIzMTk0ODA0NDAwfDE0MjMyNDExMzQzNzg.9a8b24b62b1ca77e804733288b4539c418b041ecd3789437b98b252f5ddac5ca&startOffset=0&endOffset=12000&deviceId=cUeCtyDpdESSpeONtHL2';
    var orgPath = ctx.options.playlist[0].path;

    if(!orgPath || orgPath === ''){
      res.write('no vide path');
      res.end();
      return;
    }

    ctx.options.playlist = {
      path: 'http://' + ip + ':' + port,
      type: 'video/mp4'
    };


    res.setHeader('content-type', 'video/mp4');
    var opts = grabOpts(ctx.options, 'ffmpeg-');
    console.log('incoming request for path %s', orgPath);
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*'
    });

    var trans = new Transcoder(orgPath)
      .videoCodec('h264')
      .format('mp4')
      .custom('strict', 'experimental')
      //.videoBitrate('1800')
      .on('finish', function() {
        console.log('finished transcoding');
      })
      .on('error', function(err) {
        console.log('transcoding error: %o', err);
        res.write('transcoding error: %o', err);
        res.end();
        return;
      });

    //set start time
    if(startTime){
      trans.custom('ss',startTime);
    }

    //set duration of clip
    if(endTime){
      trans.custom('t',endTime);
    }

    for (var key in opts) {
      trans.custom(key, opts[key]);
    }

    console.log(opts);

    var args = trans._compileArguments();
    args = [ '-i', '-' ].concat(args);
    args.push('pipe:1');
    console.log('spawning ffmpeg %s', args.join(' '));

    //trans.writeToFile('mp4');
    trans.stream().pipe(res);


  //}).listen(port);
  //console.log('started webserver on address %s using port %s', ip, port);
  //next();
};

module.exports = transcode;
