@extends('layouts.admin')

@section('title')
Domain Connection
@endsection

@section('content-header')
<h1>Subdomains<small>Configure your Cloudflare DNS settings.</small></h1>
<ol class="breadcrumb">
    <li><a href="{{ route('admin.index') }}">Admin</a></li>
    <li class="active">Subdomains</li>
</ol>
@endsection

@section('content')
<div class="row">
    <!--Cloudflare config-->
    <div class="col-sm-12">
        <div class="box">
            <div class="box-header with-border">
                <h3 class="box-title">Configuration</h3>
            </div>

            <form style="padding-top: 12px" action="{{ route('admin.domain.setCFkey') }}" method="POST">
                @csrf
                <div class="form-group col-xs-12">
                    <label for="CloudFlareKey" class="control-label">Cloudflare API key</label>
                    <input type="password" name="CloudFlareKey" class="form-control"
                           value="{{ $cloudflareConfig->api_key ?? '' }}"/>
                    <p class="text-muted small">You can get your API key from Cloudflare on <a
                                href="https://dash.cloudflare.com/profile/api-tokens">https://dash.cloudflare.com/profile/api-tokens</a>.
                        <span style="text-decoration: underline; text-decoration-color: red;"> <i class="redArrow right"></i> use the Edit zone DNS template <i class="redArrow left"></i> </span> </p>

                </div>

                <p class="small text-muted" style="margin-left: 12px;">The checkboxes below will only work on new records, existing records will still use the old settings.</p>
                <div class="col-xs-6">
                    <div class="checkbox checkbox-primary no-margin-bottom">
                        <input id="useAlias" name="useAlias" type="checkbox"
                        @if($cloudflareConfig->use_domain_alias ?? false) disabled @endif
                               @if($cloudflareConfig->use_alias ?? false) checked @endif/>
                        <label for="useAlias" class="strong">Use ipv4 alias</label>
                    </div>
                    <p class="text-muted small">Make sure all ip's have an alias in the form of an ipv4 before using this setting.</p>
                </div>

                <div class="col-xs-6">
                    <div class="checkbox checkbox-primary no-margin-bottom">
                        <input id="useDomainAlias" name="useDomainAlias" type="checkbox"
                        @if($cloudflareConfig->use_alias ?? false) disabled @endif
                        @if($cloudflareConfig->use_domain_alias ?? false) checked @endif/>
                        <label for="useDomainAlias" class="strong">Use domain alias</label>
                    </div>
                    <p class="text-muted small">Make sure all ip's have an alias in the form of an FQDN so we can make subdomains exclusively based on the domain.
                    While this is technically not how SRV records are supposed to be used it's still fine for most services.</p>
                </div>

                <div class="col-xs-6">
                    <div class="checkbox checkbox-primary no-margin-bottom">
                        <input id="proxyRecords" name="proxyRecords" type="checkbox" @if($cloudflareConfig->proxy_records ?? false) checked @endif/>
                        <label for="proxyRecords" class="strong">Proxy records</label>
                    </div>
                    <p class="text-muted small"><span class="text-danger">WARNING! </span> This will only apply to A or CNAME records, the SRV records will still expose the server IP if you don't use the "Use domain alias" setting.</p>
                </div>

                <div class="box-footer" style="border: 0">
                    <input type="submit" class="btn btn-sm btn-primary pull-right" value="Update config">
                </div>

                <p style="margin-left: 15px" class="text-muted small"><span class="text-danger">WARNING! </span>When you update your config and your domains aren't on the new cloudflare
                    account yet they'll get the error status, this means DNS records won't automatically be deleted with
                    server nor can new subdomains be made, existing records will keep working if they're still in
                    cloudflare. <br/> To clear this error update your config after you resolved the issue in Cloudflare.
                </p>
            </form>
        </div>
    </div>
    <!--Domains-->
    <div class="col-sm-12">
        <div class="box">
            <div class="box-header with-border">
                <h3 class="box-title">Domains</h3>
            </div>
            <div class="box-body row">
                <div class="form-group col-xs-12">
                    <label for="name" class="control-label">Add (sub)domain to be used for subdomains</label>
                    <div>
                        <form action="{{ route('admin.domain.connect') }}" method="POST">
                            @csrf
                            <div class="flex">
                                <input type="text" autocomplete="off" name="domain" class="form-control"
                                       placeholder="example.com" required/>
                                <div class="box-footer" style="padding-right: 0">
                                    <input type="submit" class="btn btn-sm btn-success pull-right" value="Add domain">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="box-body table-responsible">
                    <table class="table table-hover">
                        <tr>
                            <th>Domain</th>
                            <th>Status</th>
                            <th>Servers with this domain</th>
                            <th>Created at</th>
                            <th>Delete</th>
                            <th></th>
                        </tr>
                        @foreach ($connectedDomains as $domain)
                        <tr>
                            <td>{{ $domain->domain }}</td>
                            <td>{{ $domain->status }}</td>
                            <td> {{ $domain->serverCount}}</td>
                            <td>{{ $domain->created_at }}</td>
                            <td>
                                <form action="{{ route('admin.domain.disconnect', ['domain' => $domain->domain]) }}"
                                      method="POST">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-danger" type="submit">Delete</button>
                                </form>
                            </td>
                        </tr>
                        @endforeach
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!--Blocklist-->
    <div class="col-sm-12">
        <div class="box">
            <div class="box-header with-border">
                <h3 class="box-title">Domain blocklist</h3>
            </div>

            <form style="padding-top: 12px" action="{{ route('admin.domain.blocklist.add') }}" method="POST">
                @csrf
                <div class="form-group col-xs-6">
                    <label for="word" class="control-label">Add a word that can't be used in subdomains</label>
                    <input type="text" name="word" class="form-control"
                           placeholder="Word" required/>
                </div>
                <div class="form-group col-xs-6">
                    <label for="reason" class="control-label">Why can't this word be used in a subdomain?</label>
                    <input type="text" name="reason" class="form-control"
                           placeholder="Reason (optional)"/>
                </div>
                <div class="box-footer" style="border: 0">
                    <input type="submit" class="btn btn-sm btn-success pull-right" value="Add domain">
                </div>
            </form>
            <div class="box-body table-responsible">
                <table class="table table-hover">
                    <tr>
                        <th>Word</th>
                        <th>Reason</th>
                        <th>Added on</th>
                        <th>Delete</th>
                        <th></th>
                    </tr>
                    @foreach ($blockedDomains as $domain)
                    <tr>
                        <td>{{ $domain->subdomain }}</td>
                        <td>{{ $domain->reason }}</td>
                        <td> {{ $domain->created_at}}</td>
                        <td>
                            <form action="{{ route('admin.domain.blocklist.remove', ['id' => $domain->id]) }}"
                                  method="POST">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-danger" type="submit">Delete</button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </table>
            </div>
        </div>
    </div>
</div>

<style>
    .redArrow {
        border: solid #f00;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
    }

    .left {
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
    }

    .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
    }
</style>

@endsection
