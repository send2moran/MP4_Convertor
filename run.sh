##!/bin/bash


set -euo pipefail




yum install -y autoconf automake gcc gcc-c++ git libtool make nasm zlib-devel tar xz


# yasm
DIR=$(mktemp -d) && cd ${DIR} && \
              curl -Os http://www.tortall.net/projects/yasm/releases/yasm-${YASM_VERSION}.tar.gz && \
              tar xzvf yasm-${YASM_VERSION}.tar.gz && \
              cd yasm-${YASM_VERSION} && \
              ./configure --prefix="$SRC" --bindir="${SRC}/bin" && \
              make && \
              make install && \
              make distclean && \
              rm -rf ${DIR}

# x264
DIR=$(mktemp -d) && cd ${DIR} && \
              git clone --depth 1 git://git.videolan.org/x264 && \
              cd x264 && \
              ./configure --prefix="$SRC" --bindir="${SRC}/bin" --enable-static && \
              make && \
              make install && \
              make distclean&& \
              rm -rf ${DIR}

# libmp3lame
DIR=$(mktemp -d) && cd ${DIR} && \
              curl -L -Os http://downloads.sourceforge.net/project/lame/lame/${LAME_VERSION%.*}/lame-${LAME_VERSION}.tar.gz  && \
              tar xzvf lame-${LAME_VERSION}.tar.gz  && \
              cd lame-${LAME_VERSION} && \
              ./configure --prefix="${SRC}" --bindir="${SRC}/bin" --disable-shared --enable-nasm && \
              make && \
              make install && \
              make distclean&& \
              rm -rf ${DIR}



# ffmpeg
DIR=$(mktemp -d) && cd ${DIR} && \
              curl -Os http://ffmpeg.org/releases/ffmpeg-${FFMPEG_VERSION}.tar.gz && \
              tar xzvf ffmpeg-${FFMPEG_VERSION}.tar.gz && \
              cd ffmpeg-${FFMPEG_VERSION} --with-openssl && \
              ./configure --prefix="${SRC}" --extra-cflags="-I${SRC}/include" --extra-ldflags="-L${SRC}/lib" --bindir="${SRC}/bin" \
              --extra-libs=-ldl --enable-version3 --enable-libfaac --enable-libmp3lame --enable-libx264 --enable-libxvid --enable-gpl \
              --enable-postproc --enable-nonfree --enable-avresample --enable-libfdk_aac --disable-debug --enable-small && \
              make && \
              make install && \
              make distclean && \
              hash -r && \
              rm -rf ${DIR}



yum remove -y autoconf automake gcc gcc-c++ git libtool nasm  zlib-devel tar xz perl libgomp libstdc++-devel
yum clean all
rm -rf /var/lib/yum/yumdb/*
echo "/usr/local/lib" > /etc/ld.so.conf.d/libc.conf
