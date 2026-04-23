@extends('layouts.arix', ['navbar' => 'layout', 'sideEditor' => true])

@section('title')
    Arix Layout
@endsection

@section('content')

    <form action="{{ route('admin.arix.layout') }}" method="POST">
        <div class="header">
            <p>General layout settings</p>
            <span class="description-text">Change the general layout settings of Arix Theme.</span>
        </div>
        <div>
            <p class="subtitle">General Layout</p>
            <div class="layout-grid">
                <x-arix.layout-option 
                    id="arix:layout:1" 
                    name="arix:layout"
                    value="1"
                    :oldValue="$layout" 
                    label="Sidebar"
                    img="/arix/layout/layout-1.svg"
                />
                <x-arix.layout-option 
                    id="arix:layout:2" 
                    name="arix:layout"
                    value="2"
                    :oldValue="$layout" 
                    label="Sidebar Power Actions"
                    img="/arix/layout/layout-2.svg"
                />
                <x-arix.layout-option 
                    id="arix:layout:3" 
                    name="arix:layout"
                    value="3"
                    :oldValue="$layout" 
                    label="Top Navigation"
                    img="/arix/layout/layout-3.svg"
                />
                <x-arix.layout-option 
                    id="arix:layout:4" 
                    name="arix:layout"
                    value="4"
                    :oldValue="$layout" 
                    label="Slim Sidebar"
                    img="/arix/layout/layout-4.svg"
                />
                <x-arix.layout-option 
                    id="arix:layout:5" 
                    name="arix:layout"
                    value="5"
                    :oldValue="$layout" 
                    label="Sidebar Filled Hover"
                    img="/arix/layout/layout-5.svg"
                />
            </div>
        </div>

        <div class="input-field">
            <label for="arix:logoPosition">Search or select bar</label>
            <select name="arix:searchComponent" value="{{ old('arix:searchComponent', $searchComponent) }}">
                <option value="1">Server select bar</option>
                <option value="2" @if(old('arix:searchComponent', $searchComponent) == '2') selected @endif>Searchbar</option>
            </select>
            <small>Where do you want the logo on the login screen.</small>
        </div>

        <hr />
        
        <div class="header">
            <p>Login layout settings</p>
            <span class="description-text">Change the layout settings of the auth pages of Arix Theme.</span>
        </div>
        <div>
            <p class="subtitle">Login layout</p>
            <div class="layout-grid">
                <x-arix.layout-option 
                    id="arix:loginLayout:1" 
                    name="arix:loginLayout"
                    value="1"
                    :oldValue="$loginLayout" 
                    label="Default"
                    img="/arix/layout/loginLayout-1.svg"
                />
                <x-arix.layout-option 
                    id="arix:loginLayout:2" 
                    name="arix:loginLayout"
                    value="2"
                    :oldValue="$loginLayout" 
                    label="Side Banner"
                    img="/arix/layout/loginLayout-2.svg"
                />
                <x-arix.layout-option 
                    id="arix:loginLayout:3" 
                    name="arix:loginLayout"
                    value="3"
                    :oldValue="$loginLayout" 
                    label="Floating Image"
                    img="/arix/layout/loginLayout-3.svg"
                />
                <x-arix.layout-option 
                    id="arix:loginLayout:4" 
                    name="arix:loginLayout"
                    value="4"
                    :oldValue="$loginLayout" 
                    label="Flat"
                    img="/arix/layout/loginLayout-4.svg"
                />
            </div>
        </div>

        <div class="input-field">
            <label for="arix:socialPosition">Social position</label>
            <select name="arix:socialPosition" value="{{ old('arix:socialPosition', $socialPosition) }}">
                <option value="1">Above form</option>
                <option value="2" @if(old('arix:socialPosition', $socialPosition) == '2') selected @endif>Under form</option>
            </select>
            <small>Where do you want the social buttons on the login screen.</small>
        </div>
        <div class="input-field">
            <label for="arix:logoPosition">Logo Position</label>
            <select name="arix:logoPosition" value="{{ old('arix:logoPosition', $logoPosition) }}">
                <option value="1">Above form</option>
                <option value="2" @if(old('arix:logoPosition', $logoPosition) == '2') selected @endif>Top corner</option>
            </select>
            <small>Where do you want the logo on the login screen.</small>
        </div>
        <div class="floating-button">
            {!! csrf_field() !!}
            <button type="submit" class="button button-primary">Save changes</button>
        </div>
    </form>
@endsection