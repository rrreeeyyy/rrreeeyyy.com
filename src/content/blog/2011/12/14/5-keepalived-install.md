---
title: '#5 KeepAlivedを入れる(おまけ付)'
author: rrreeeyyy
categories:
  - Ruby
  - インフラ
pubDate: 2011/12/14
---
入れる。
(単なる作業メモ…)

作業手順
CentOS6系

カーネルのバージョン

2.6.32-71.29.1.el6.x86_64

http://www.keepalived.org/software/keepalived-1.2.2.tar.gz

<!--more-->

カーネル組み込みのIPVSのバージョン確認

```
# grep VERSION_CODE /usr/include/linux/ip_vs.h
#define IP_VS_VERSION_CODE      0x010201

```

=>1.2.1であることを確認

yum install ipvsadmする際に、
上で確認したカーネル組み込みのIPVSのバージョンより、
yumで入れるipvsadmのバージョンが新しい事を確認すること。

ipvsadm入れてkeepalivedをおもむろにconfigure

```
[root@rrreeeyyy keepalived-1.2.2]# yum install ipvsadm
[root@rrreeeyyy src]# wget http://www.keepalived.org/software/keepalived-1.2.2.tar.gz
[root@rrreeeyyy src]# tar zxfv keepalived-1.2.2.tar.gz
[root@rrreeeyyy src]# cd keepalived-1.2.2
[root@rrreeeyyy keepalived-1.2.2]# ./configure --with-kernel-dir=/lib/modules/`uname -r`/build

configure: error: Popt libraries is required
```

popt librariesがないので入れておもむろにconfigure

```
[root@rrreeeyyy keepalived-1.2.2]# yum install popt-devel

[root@rrreeeyyy keepalived-1.2.2]# ./configure --with-kernel-dir=/lib/modules/`uname -r`/build

Keepalived version       : 1.2.2
Compiler                 : gcc
Compiler flags           : -g -O2
Extra Lib                : -lpopt -lssl -lcrypto
Use IPVS Framework       : Yes
IPVS sync daemon support : Yes
IPVS use libnl           : No
Use VRRP Framework       : Yes
Use Debug flags          : No
```

IPVS use libnlがNoになってるので入れておもむろに

```
[root@rrreeeyyy keepalived-1.2.2]# yum install libnl-devel

[root@rrreeeyyy keepalived-1.2.2]# ./configure --with-kernel-dir=/lib/modules/`uname -r`

Keepalived configuration
------------------------
Keepalived version       : 1.2.2
Compiler                 : gcc
Compiler flags           : -g -O2
Extra Lib                : -lpopt -lssl -lcrypto  -lnl
Use IPVS Framework       : Yes
IPVS sync daemon support : Yes
IPVS use libnl           : Yes
Use VRRP Framework       : Yes
Use Debug flags          : No

[root@rrreeeyyy keepalived-1.2.2]# make

Make complete
[root@rrreeeyyy keepalived-1.2.2]# make install

```

起動スクリプトの類をなんとか

```
[root@rrreeeyyy bin]# ln -s /usr/local/src/keepalived-1.2.2/bin/keepalived /usr/sbin/keepalived
[root@rrreeeyyy bin]# cp -a /usr/local/src/keepalived-1.2.2/keepalived/etc/init.d/keepalived.rh.init /etc/init.d/keepalived
[root@rrreeeyyy bin]# cp -a /usr/local/src/keepalived-1.2.2/keepalived/etc/init.d/keepalived.sysconfig /etc/sysconfig/keepalived

```

```
mkdir /etc/keepalived

```

をしてあげてその下にkeepalived.conf等の設定ファイルを置く。
設定ファイルのsample

```
/usr/local/src/keepalived-1.2.2/keepalived/etc/keepalived/keepalived.conf

```

においてあるので、/etc/keepalived配下にコピーする。

```
# ip addr show
    inet 192.168.200.16/32 scope global eth0
    inet 192.168.200.17/32 scope global eth0
    inet 192.168.200.18/32 scope global eth0
# ipvsadm -Ln
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
TCP  192.168.200.100:443 rr persistent 50
TCP  192.168.201.100:1358 rr persistent 50
  -> 192.168.200.200:1358         Masq    1      0          0
TCP  10.10.10.3:1358 rr persistent 50

```

こんなかんじで、VIPとipvsadmの振り分けが一応設定されていれば恐らくインストール成功。
あとは頑張ってkeepalived.confを書く。

おわり

# おまけ:

# 仮想ホストにruby入れる

おもむろに

```
[root@coco-01 ruby-1.9.3-p0]# wget ftp://ftp.ruby-lang.org/pub/ruby/1.9/ruby-1.9.3-p0.tar.gz
[root@coco-01 ruby-1.9.3-p0]# tar zxfv ruby-1.9.3-p0.tar.gz
[root@coco-01 ruby-1.9.3-p0]# ./configure --prefix=/usr/local/ruby-1.9.3/
[root@coco-01 ruby-1.9.3-p0]# make
[root@coco-01 ruby-1.9.3-p0]# make install
```

おわり

と思いきや

```
[root@coco-01 ruby-1.9.3]# gem install sinatra
/usr/local/ruby-1.9.3/lib/ruby/1.9.1/yaml.rb:56:in `':
It seems your ruby installation is missing psych (for YAML output).
To eliminate this warning, please install libyaml and reinstall your ruby.
```

こんなエラーが出たので、libyamlを入れる事に。
CentOSはyumでレポジトリ追加しなきゃいけないぽくて面倒だったのでビルドした。

```
[root@coco-01 src]# wget http://pyyaml.org/download/libyaml/yaml-0.1.4.tar.gz
[root@coco-01 src]# tar zxfv yaml-0.1.4.tar.gz
[root@coco-01 yaml-0.1.4]# ./configure
[root@coco-01 yaml-0.1.4]# make
[root@coco-01 yaml-0.1.4]# make install
[root@coco-01 bin]# vim /etc/ld.so.conf.d/libyaml.conf

(+) /usr/local/lib

[root@coco-01 yaml-0.1.4]# ldconfig
```

rubyを再度上の手順でリコンパイルしてmake&&make install

gemのエラーが無事消える

おわり
