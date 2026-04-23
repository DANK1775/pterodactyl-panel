<?php

namespace Pterodactyl\Models\Plugins;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstalledPlugins extends Model {
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'plugins_addon_installed_plugins';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'plugin_service',
        'plugin_version',
        'plugin_service_id',
        'server_id',
        'plugin_name',
        'plugin_icon',
        'file_name'
    ];
}
