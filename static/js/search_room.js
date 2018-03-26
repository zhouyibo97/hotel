// @ts-nocheck
jQuery.validator.addMethod( "roomnum", function ( value, element, param )
{
	//	var reg=/^1[0-9]{10}$/;
	var reg = new RegExp( "^1[0-9]{10}$" );
	if ( reg.test( value ) )
	{
		return true;
	} else
	{
		return false;
	}
}, "请输入正确的房号" );

var roomsearch = {
	//配置
	config: {
		server: '',
		ports: {
			list: '/listroom',
			login: '/user/login',
			rcreate: '/rcreate',
			remove1: '/remove1',
			update1: "/update1"
		}
	},
	//数据
	data: {
		list: [],
		keyword: "",
		token: ""
	},
	//DOM节点
	elements: {
		list_view: undefined,
		items: []
	},
	//模板
	template: {
		//		列表
		list: function ()
		{
			return $( '<ul class="row card_list"></ul>' );
		},
		//		元素
		item: function ( record )
		{
			var str = [
				'<li class="col-sm-6 col-md-4 card_item">',
				'<div class="card">',
				'<div class="row">',
				'<div class="info col-sm-3 col-xs-4">',
				'<span class="roomnum">房号@{roomnum}</span>',
				'<span class="people">人数@{people}</span>',
				'</div>',
				'<div class="col-sm-3">',
				'<span class="hadpeople">已住人数@{hadpeople}</span>',
				'</div>',
				'<div class="col-sm-3">',
				'<span class="glyphicon glyphicon-usd"></span>',
				'<span class="price">@{price}</span>',
				'</div>',
				'<div class="col-sm-3">',
				'<span class="glyphicon glyphicon-usd"></span>',
				'<span class="allprice">@{allprice}</span>',
				'</div>',
				'<div class="control col-xs-2">',
				'<button type="button" class="edit">',
				'<i class="glyphicon glyphicon-edit"></i>',
				'</button>',
				'<button type="button" class="remove">',
				'<i class="glyphicon glyphicon glyphicon-remove"></i>',
				'</button>',
				'</div>',
				'</div>',
				'<div>',
				'</li>'

			];
			var $el = $(
				str.join( "" ).replace( "@{roomnum}", record.roomnum )
					.replace( "@{people}", record.people )
					.replace( "@{hadpeople}", record.hadpeople )
					.replace( "@{price}", record.price )
					.replace( "@{allprice}", record.allprice )
			);

			$el.data( "record_id", record._id );
			$el.data( "roomnum", record.roomnum );
			$el.data( "people", record.people );
			$el.data( "hadpeople", record.hadpeople );
			$el.data( "price", record.price );
			$el.data( "allprice", record.allprice );
			$el.find( ".remove" ).data( {
				"_id": record._id,
				"roomnum": record.roomnum,
				"people": record.people,
				"hadpeople": record.hadpeople,
				"price": record.price,
				"allprice": record.allprice
			} );
			$el.find( ".edit" ).data( {
				"record": record
			} );
			//record.mprice && $el.find(".qrcode").qrcode(record.mprice);
			if ( !window.localStorage.getItem( "token" ) )
			{
				$el.find( ".control" ).remove();
			}
			return $el;
		}
	},
	//	创建列表DOM
	createList: function ( list )
	{

		this.elements.items = [];
		for ( var i = 0; list[ i ]; i++ )
		{
			this.elements.items.push( this.template.item( list[ i ] ) );
		}

		this.elements.list_view.html( "" );
		this.elements.list_view.append( this.elements.items );
	},
	//	加载列表数据
	getList: function ( callback )
	{
		var me = this;

		$( "#list_box2" ).blockLoading().show();
		$.ajax( {
			url: me.config.server + me.config.ports.list,
			type: "get",
			dataType: "json",
			data: {
				keyword: me.data.keyword
			},
			success: function ( response )
			{

				me.data.list = response;
				callback.call( me, response );
			},
			complete: function ()
			{
				$( "#list_box2" ).blockLoading().hide();
			}
		} );
	},
	//	登录动作
	doLogin: function ()
	{
		var me = this;
		$.ajax( {
			url: me.config.server + me.config.ports.login,
			type: 'post',
			dataType: 'json',
			data: $( "#form_login" ).serialize(),
			success: function ( response )
			{
				window.localStorage.setItem( "token", response.token );
				me.data.token = response.token;
				me.initView();
				$( "#pop_login" ).modal( "hide" );
			}
		} )
	},
	//	取消登录状态
	doLogout: function ()
	{
		var me = this;
		me.data.token = "";
		window.localStorage.removeItem( "token" );
		me.initView();
	},
	//	初始化视图
	initView: function ()
	{
		var me = this;
		if ( !!me.data.token )
		{
			//已验证身份
			$( ".no_login" ).hide()
			$( ".need_login" ).show()
		} else
		{
			//没验证身份
			$( ".no_login" ).show()
			$( ".need_login" ).hide()
		}

		me.createList( me.data.list );

	},
	//	显示添加表单
	hadner_show_add: function ()
	{
		$( "#pop_add" ).modal( "show" );
		$( "#pop_add" ).find( ".has-error" ).removeClass( "has-error" );
		$( "#pop_add" ).find( ".has-success" ).removeClass( "has-success" );
		$( "#pop_add" ).find( ".help-block" ).html( "" );

		$( '#form_create1' ).get( 0 ).reset();
	},
	//	显登录表单
	handler_login: function ()
	{
		$( "#pop_login" ).modal( "show" );
	},
	//	向服务器提交添加
	handler_do_create1: function ()
	{
		var me = this;
		if ( $( "#form_create1" ).valid() )
		{
			$.ajax( {
				url: me.config.server + me.config.ports.rcreate,
				type: "post",
				dataType: "json",
				headers: {
					token: me.data.token
				},
				data: $( "#form_create1" ).serialize(),
				success: function ( response )
				{
					$( "#pop_add" ).modal( "hide" );
					me.getList( me.createList );
				}
			} );
		}

	},
	//	请求删除一条
	handler_remove: function ( id, roomnum, people, hadpeople, price, allprice )
	{
		var me = this;

		$.bs_confirm( {
			title: '删除房间',
			message: '删除后不可恢复，你确认要删除“' + roomnum + '”吗？',
			enter_callback: function ()
			{
				$.ajax( {
					type: "post",
					dataType: "json",
					url: me.config.server + me.config.ports.remove1,
					headers: {
						token: me.data.token
					},
					data: {
						_id: id,
						roomnum: roomnum,
						people: people,
						hadpeople: hadpeople,
						price: price,
						allprice: allprice
					},
					success: function ( response )
					{
						me.getList( me.createList );
					}
				} );
			}
		} );
	},
	//	显示编辑界面
	handler_show_update: function ( el )
	{

		var record = $( el ).data( "record" );
		var modal = $( "#pop_edit" );
		var form = $( "#form_edit" );

		form[ 0 ].reset();
		form.find( "[name='roomnum']" ).val( record.roomnum );
		form.find( "[name='people']" ).val( record.people );
		form.find( "[name='hadpeople']" ).val( record.hadpeople );
		form.find( "[name='price']" ).val( record.price );
		form.find( "[name='allprice']" ).val( record.allprice );
		form.find( "[name='id']" ).val( record._id );

		modal.modal( "show" );

	},
	//	提交修改内容
	handler_do_submit_update: function ()
	{
		var me = this;
		if ( $( "#form_create1" ).valid() )
		{
			$.ajax( {
				url: me.config.server + me.config.ports.update1,
				type: "post",
				dataType: "json",
				headers: {
					token: me.data.token
				},
				data: $( "#form_edit" ).serialize(),
				success: function ( response )
				{
					$( "#pop_edit" ).modal( "hide" );
					me.getList( me.createList );
				}
			} );
		}
	},
	//	初始化整个界面
	init: function ( target )
	{
		var me = this;

		this.data.token = window.localStorage.getItem( "token" );

		var $targetEl = $( target );
		this.elements.list_view = this.template.list();
		//$targetEl.html("");
		$targetEl.append( this.elements.list_view );
		this.getList( this.createList );

		me.initView();
		//为按钮加挂事件
		//显示添加按钮
		$( "#btn_add" ).on( "click", function ()
		{
			me.hadner_show_add();
		} )
		//		显示登录按钮
		$( "#show_login" ).on( "click", function ()
		{
			me.handler_login();
		} )
		//执行搜索
		$( "#doSearch1" ).on( "click", function ()
		{
			me.data.keyword = $( "#keyword1" ).val();
			me.getList( me.createList );
			$( "#navbar-collapse" ).collapse( "hide" )
		} );
		//在搜索input上回车时的动作
		$( "#room_search" ).on( "submit", function ( e )
		{
			me.data.keyword = $( "#keyword1" ).val();
			me.getList( me.createList );
			//取消默认行为
			e.preventDefault();
			$( "#navbar-collapse" ).collapse( "hide" )
			//			e.stopPropagation();
		} );
		//登录按钮
		$( "#btn_doLogin" ).on( "click", function ()
		{
			me.doLogin();
		} );
		// //登出按钮
		$( "#do_logout" ).on( "click", function ()
		{
			me.doLogout();
		} );
		// //		添加按钮
		$( "#btn_create" ).on( 'click', function ()
		{
			me.handler_do_create1();
		} );
		// //		列表中的删除按钮事件
		me.elements.list_view.on( "click", ".remove", function ()
		{
			me.handler_remove( $( this ).data( "_id" ), $( this ).data( "roomnum" ), $( this ).data( "people" ), $( this ).data( "hadpeople" ), $( this ).data( "price" ), $( this ).data( "allprice" ) );
		} );
		// //		列表中的编辑按钮的事件
		me.elements.list_view.on( "click", ".edit", function ()
		{
			me.handler_show_update( this );
		} );
		// //编辑界面的提交按钮
		$( "#btn_update" ).on( "click", function ()
		{
			me.handler_do_submit_update();
		} );

		//启动验证插件
		$( "#form_create1" ).validate( {
			rules: {
				roomnum: {
					required: true,
					minlength: 3,
					maxlength:3
				},
				people: {
					required: true,
					minlength:0
				},
				hadpeople:{
					required: true,
					min:0
				},
				price: {
					required: true,
					min:200
				},
				allprice:{
					required: true,
					min:200
				}
			},
			success: function ( l, el )
			{
				var parent = $( el ).parent().parent();
				parent.removeClass( "has-error" );
				parent.addClass( "has-success" );
				parent.find( ".help-block" ).html( "" );
			},
			errorPlacement: function ( err, el )
			{
				var parent = $( el ).parent().parent();
				parent.addClass( "has-error" );

				parent.find( ".help-block" ).html( err.html() );
			}
		} );

		//启动验证插件
		$( "#form_edit" ).validate( {
			rules: {
				roomnum: {
					required: true,
					minlength: 3,
					maxlength:3
				},
				people: {
					required: true,
					minlength:0
				},
				hadpeople:{
					required: true,
					min:0
				},
				price: {
					required: true,
					min:200
				},
				allprice:{
					required: true,
					min:200
				}
			},
			success: function ( l, el )
			{
				var parent = $( el ).parent().parent();
				parent.removeClass( "has-error" );
				parent.addClass( "has-success" );
				parent.find( ".help-block" ).html( "" );
			},
			errorPlacement: function ( err, el )
			{
				var parent = $( el ).parent().parent();
				parent.addClass( "has-error" );

				parent.find( ".help-block" ).html( err.html() );
			}
		} );
	}

}

$( function ()
{
	roomsearch.init( "#list_container1" )
} );
