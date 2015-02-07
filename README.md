#For HTTPS Support in ffmpeg:
brew reinstall ffmpeg --with-openssl !!!!!
BUILDPACK_URL
//https://github.com/brooks/heroku-buildpack-ffmpeg-x264
//https://github.com/integricho/heroku-buildpack-python-ffmpeg

heroku logs --tail




echo 'export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:vendor/ffmpeg/lib:vendor/faac/lib:vendor/libogg/lib:vendor/libvorbis/lib:vendor/mp3lame/lib:vendor/x264/lib"' >> $PROFILE_PATH



echo 'export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$HOME/vendor/ffmpeg/lib"' >> $PROFILE_PATH
