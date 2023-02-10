---
title: 'Serverspec と Infrataster でサーバのテストをする'
author: rrreeeyyy
published: true
categories:
  - infrastructure
  - linux
comments: true
pubDate: 2014/05/12
---

サーバの構築・運用の効率化の為に Test-Driven Infrastructure をする手法として、

[Serverspec][1] が登場して 1 年近く経ちました。

そして最近、Infrastructure Behavior Testing Framework として、

[Infrataster][2] が登場しました。

今日は、上記で紹介した 2 つを組み合わせて使用し、

実際にどのようにサーバのテストを行うかについて書きます。

<!--more-->

---

# 書くこと・書かないこと

## - 書くこと

* Serverspec と Infrataster を両方使った Test-Driven Infrastructure の一手法に関して


今日書くのは、Serverspec と Infrataster を組み合わせることで、

Serverspec がカバーしている領域と Infrataster がカバーしている領域の両方をテストする一手法に関してです。

## - 書かないこと

* Test-Driven Infrastructure についてのベストプラクティス
* TDD や BDD と言ったそもそものテスト手法について

これらは、個々人やプロジェクト単位で、ベストプラクティス・手法が異なると思っています。

その為、ここに書いてある事が必ずもベストではありません。(もちろん、マッチする人も居るかもしれません)

また、そもそもの言葉の定義や、Test-Driven Infrastructure のあり方について等は書きません。

# 前提

* Ruby がインストールされていること [^1]
* bundler がインストールされていること [^2]

# インストール

まずは、テストを行うプロジェクト用のディレクトリを用意し、

Serverspec と Infrataster をインストールします。

また、Infrataster で MySQL のテストを行うため、

[infrataster-plugin-mysql][3] も同時にインストールします。[^3]

```bash
mkdir servertest
cd servertest
```

```bash
bundle init
echo 'gem "rake"' >> Gemfile
echo 'gem "serverspec"' >> Gemfile
echo 'gem "infrataster"' >> Gemfile
echo 'gem "infrataster-plugin-mysql"' >> Gemfile

bundle install --path vendor/bundle
```

# 設定

ホスト固有の設定値等を用いるために、

Serverspec のテストの実行を、

[advanced\_tips][4] の "How to use host specific properties" に沿ったものにします。

Rakefile を以下のように書きます。

## - Rakefile

```bash
$EDITOR Rakefile
```

```ruby
require 'rake'
require 'rspec/core/rake_task'
require 'yaml'

properties = YAML.load_file('properties.yml')

desc "Run serverspec to all hosts"
task :spec => 'serverspec:all'

namespace :serverspec do
  task :all => properties.keys.map {|key| 'serverspec:' + key.split('.')[0] }
  properties.keys.each do |key|
    desc "Run serverspec to #{key}"
    RSpec::Core::RakeTask.new(key.split('.')[0].to_sym) do |t|
      ENV['TARGET_HOST'] = key
      t.pattern = 'spec/{' + properties[key][:roles].join(',') + '}/*_spec.rb'
    end
  end
end
```

## spec\_helper.rb

次に spec というディレクトリを作成しておき、

spec 配下に spec\_helper.rb を生成します。

```bash
mkdir spec
$EDITOR spec/spec_helper.rb
```

ここで、Serverspec の設定と Infrataster のサーバ定義を同時に行います。

```ruby
require 'serverspec'
require 'pathname'
require 'net/ssh'
require 'yaml'
require 'infrataster/rspec'
require 'infrataster-plugin-mysql'

include Serverspec::Helper::Ssh
include Serverspec::Helper::DetectOS
include Serverspec::Helper::Properties

properties = YAML.load_file('properties.yml')

properties.keys.each do |host|
  Infrataster::Server.define(
    properties[host][:name],
    host,
    ssh: {host_name: host, user: properties[host][:user], keys: ['~/.ssh/id_rsa']},
    from: properties[host][:from],
    mysql: {user: properties[host][:mysql_user], password: properties[host][:mysql_password]}
  )
end

RSpec.configure do |c|
  c.host  = ENV['TARGET_HOST']
  set_property properties[c.host]
  options = Net::SSH::Config.for(c.host)
  user    = options[:user] || Etc.getlogin
  c.ssh   = Net::SSH.start(c.host, user, options)
  c.os    = backend.check_os
end
```

## - properties.yml

ホスト毎の定義や設定値を書く yaml ですが、

ここでは以下のような例にします。

``` bash
$EDITOR properties.yml
```

``` yaml
rrreeeyyy.com:
  :roles:
    - base
  :name: :proxy
  :user: :rrreeeyyy

web-01.rrreeeyyy.com:
  :roles:
    - base
    - web
  :name: :web
  :user: :rrreeeyyy

db-01.rrreeeyyy.com:
  :roles:
    - base
    - db
  :name: :db
  :user: :rrreeeyyy
  :from: :web
  :mysql_user: 'username'
  :mysql_password: 'password'
```

こうすることで、Serverspec では以下のホストに対し任意のテストを実行します。[^4]

* rrreeeyyy.com
* web-01.rrreeeyyy.com
* db-01.rrreeeyyy.com

また、Infrataster 側では、以下のホストが定義されたことになります。

* :proxy
* :web
* :db

# テストを書く

先ほど yaml ファイルで定義した role 毎にディレクトリを作成します。

その配下に置かれた \*\_spec.rb というファイルは、テスト実行時に全て実行されます。

spec 配下のディレクトリ構成を以下のようにします。

```
.
├── base
│   └── base_spec.rb
├── db
│   └── db_spec.rb
├── spec_helper.rb
└── web
    └── web_spec.rb
```

それぞれの spec ファイルについて見ていきます。

## - base\_spec.rb

全てのホストの role に base がついているので、

この spec ファイルに書いてあるテストは、定義した全てのホストで実行されます。

そのため、22 番ポートが Listen しているかをテストしています。

```ruby
require 'spec_helper'

describe port(22) do
  it { should be_listening }
end
```

他にも、ntp や sysctl の設定などで、全ホストで共通するものを書いていくと良いと思います。

もちろん、ディレクトリ内にある \*\_spec.rb ファイルは全て実行されるため、

ntp\_spec.rb, sshd\_spec.rb, sysctl\_spec.rb 等に分けても問題ありません。

むしろ、テストが肥大化してきたらファイルを分割するべきかと思います。

にも、ntp や sysctl の設定などで、全ホストで共通するものを書いていくと良いと思います。

もちろん、ディレクトリ内にある \*\_spec.rb ファイルは全て実行されるため、

ntp\_spec.rb, sshd\_spec.rb, sysctl\_spec.rb 等に分けても問題ありません。

むしろ、テストが肥大化してきたらファイルを分割するべきかと思います。

## - web\_spec.rb

web\_spec.rb は web ディレクトリ配下にあるため、

role に web がついている、web-01.rrreeeyyy.com サーバでのみ実行されます。

80 番ポートが Listen していることに加えて、

rrreeeyyy.com へアクセスし、レスポンスに 'rrreeeyyy - Powered by' が含まれていること、

レスポンスヘッダの content-type が text/html であることをテストしています。

```ruby
require 'spec_helper'

describe port(80) do
  it { should be_listening }
end

describe server(property[:name]) do
  describe http('http://' + ENV['TARGET_HOST'].gsub('web-01.','')) do
    it "responds content including 'rrreeeyyy - Powered by'" do
      expect(response.body).to include('rrreeeyyy - Powered by')
    end
    it "responds as 'text/html'" do
      expect(response.headers['content-type']).to match(%r{^text/html})
    end
  end
end
```

なお、Infrataster の http は Ruby HTTP クライアントライブラリである Faraday を使用しています。

後述の :from を用いると、特定のホストからアクセスした時にどのように表示されるか、などもテスト可能です。

また、Web アプリケーションのテストフレームワークである Capybara を使用することも可能なので、

複雑な Web アプリケーションのルーティング等もテスト可能だと思われます。

## - db\_spec.rb

db\_spec.rb は db ディレクトリ配下にあるため、

role に db がついている、db-01.rrreeeyyy.com サーバでのみ実行されます。

```ruby
require 'spec_helper'

describe port(3306) do
  it { should be_listening }
end

describe server(:db) do
  describe mysql_query('SHOW STATUS') do
    it 'returns positive uptime' do
      row = results.find {|r| r['Variable_name'] == 'Uptime' }
      expect(row['Value'].to_i).to be > 0
    end
  end
end
```

Infrataster は :from が付いていると、定義されたサーバからの振る舞いをテストします。

今回の場合、db サーバには :from :web が付いている為、

web-01 サーバから db-01 サーバへ MySQL で接続できるかをテストします。

仕組みとしては、db-01 サーバの 3306 番ポートを、

web-01 サーバを経由してローカルへ SSH ポートフォワードします。[^5]

その後、Ruby の mysql2 ライブラリを用いて、クエリを発行します。

なお、3306 番ポートが LISTEN しているかどうかテストする部分に関しては、

Serverspec の管轄内になるので、内部的には db-01 サーバに SSH して、

netstat の結果を取得してテストしています。

# 何がいいか、どんな風にテストを書いていくかの例

## - 何がいいか

Serverspec と Infrataster はテスト対象のレイヤーが少々異なっています。

Infrataster は 次の記事のように、nginx のルーティングをテストしたり、

* [[Infrataster] InfratasterでNginxのルーティングのテスト書いてる][5]

MySQL のクエリを発行し、その結果をテストするなど、

かなりアプリケーションに近いレイヤーでのテストを行います。

その一方で、サーバ内にインストール済のパッケージや、設定ファイルの詳細をテストするのはやや困難です。[^6]

Serverspec では、サーバ内の設定や、導入済みのパッケージなど、

Infrataster よりやや低いレイヤーにフォーカスしてテストを行うのが得意なように見えます。

その一方で、MySQL のクエリを発行した結果をテストするのはやや困難です。

この 2 つを組み合わせて使用することにより、サーバのより広いレイヤーに対してテストを行うことが可能になります。

## - どんな風にテストを書いていくかの例

あくまで一例ですが、頭の整理的にこんな使い方も出来ます。

### - Web アプリをデプロイする対象のサーバ構築をテストしたい

* デプロイする Web アプリは 'Hello World' と画面に出力する

まずこれを書く

``` ruby
describe http('http://app') do
  it "responds content including 'Hello World'" do
    expect(response.body).to include('Hello World')
  end
end
```

当然失敗するわけです。

* そうだ、Web アプリがレスポンスを返すためには 80 番ポートを Listen する必要があるなあ

``` ruby
describe port(80) do
  it { should be_listening }
end

describe http('http://app') do
  it "responds content including 'Hello World'" do
    expect(response.body).to include('Hello World')
  end
end
```

上にテストを書きます。

* そうだ、80 番ポートを Listen するためには httpd が入っている必要があるなあ

``` ruby
describe package('httpd') do
  it { should be_installed }
end

describe port(80) do
  it { should be_listening }
end

describe http('http://app') do
  it "responds content including 'Hello World'" do
    expect(response.body).to include('Hello World')
  end
end
```

更に上にテストを書きます。

ここで初めて、ansible や chef の playbook や cookbook を書き始めます。[^7]

そしてテストをすると、一番上のテストは通るわけです、じゃあ次は 80 番ポートの Listen ,

じゃあ次は index.html の設置 ... 等とコードベースでテストをしながらサーバを構築していく。

... なんて方法も、ありじゃないでしょうか？

# まとめ

* サーバ構築のテストツールである Serverspec と Infrataster を一緒に使うテスト手法について説明
    * 広いレイヤーでテストが出来る
        * Nginx のルーティングや、MySQL のクエリ実行結果 (Infrataster)
        * 特定のホストから見た、他のテストの振る舞い (Infrataster)
        * サーバにインストールされているプロダクトの設定ファイルの詳細 (Serverspec)
        * サーバの iptables の設定値 (Serverspec)
* Serverspec と Infrataster を使ったテスト駆動インフラ構築の一例
    * 目的からトップダウンでテストを書いて、ボトムアップで構築していく方法
    * あくまで一例なので、合う合わないは当然ある

 [1]: http://serverspec.org/
 [2]: https://github.com/ryotarai/infrataster
 [3]: https://github.com/ryotarai/infrataster-plugin-mysql
 [4]: http://serverspec.org/advanced_tips.html
 [5]: http://apehuci-kitaitimakoto.sqale.jp/apehuci/?date=20140505

 [^1]: 本記事では 2.1.2 で検証しましたが、1.9 以降なら恐らく正常動作するでしょう。
 [^2]: gem install bundler で入ります。
 [^3]: Ruby の mysql ライブラリのインストール時に、mysql-devel のようなライブラリを必要とします。
 [^4]: もちろん、この時点ではまだテストを書いていないので、何も実行されません。
 [^5]: ポート番号は、Infrataster::Server.define の mysql に port オプションを与えれば変更可能です。
 [^6]: ssh.exec を用いれば可能に見えます。それは serverspec の command で mysql クエリを発行すれば infrataster のテストが出来るのと同じように。
 [^7]: あるいは、涙を流しながら手で yum install httpd を実行します。

