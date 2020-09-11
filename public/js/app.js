'use strict'

$('#updateDetailsForm').hide();
$('#hamMenu').hide();

$('#UpdateBtn').on('click',()=>{$('#updateDetailsForm').toggle();})

$('#menu').on('click',()=>{$('#hamMenu').toggle();})
$('main').on('click',()=>{$('#hamMenu').hide();})

