ArenaObj = function(strurl, cloneObj, callbackLoaded) {
    this.callbackLoaded = callbackLoaded;
    this.propertyCreating = $('#arena_creating');
    this.transslider = $('#transslider');

    //Create new
    if(cloneObj == null || typeof(cloneObj)==='undefined')
        this.init(strurl);
    else {
        if( cloneObj.type =='group' )
            this.fromGroupObj(cloneObj);
    }
}

var main;
$.extend(ArenaObj.prototype, {
    // object variables
    class_name: 'ArenaObj',
    type: 'ArenaObj',

    imgpath: '',
    transvalue: 100,
  
    shape: null,
    imgObj : null, //image
    arrAllObjs : null,

    total : 0,
    
    status : 'creating', //'created'
    width : 800,
    height : 600,

    init: function(strurl) {
        main = this;
        this.status = 'creating';

        this.createObjs(strurl);
    },

    clone: function(cloneObj) {
    },

    fromGroupObj: function(groupobj) {
        this.status = 'normal';
        this.total = groupobj.total;

        this.arrAllObjs = [];
        this.imgObj = groupobj.getObjects()[0];
        this.imgpath = this.imgObj.src;
        this.arrAllObjs.push(this.imgObj);
        if(this.imgObj.opacity == null)
            this.imgObj.opacity = 1;
        this.transvalue = Math.round(this.imgObj.opacity * 100);

        this.shape = groupobj;
        this.shapeInitFunctions();
    },

    getInitZoom: function() {
        var rate_w = (canvas.width - 100) / this.width;
        var rate_h = (canvas.height - 100) / this.height;
        var zoom = Math.min(rate_w, rate_h);
        if(zoom > 1)
            zoom = 1;
        return zoom;
    },

    //Create All of Objects for Square
    createObjs: function(strurl) {
        this.arrAllObjs = [];
        this.imgObj = null;
        this.imgpath = strurl;

        if(!canvas)
            return;
        var me = this;
        fabric.Image.fromURL(this.imgpath, function(img)
        {
            
            main.width = img.width;
            main.height = img.height;
            var zoom = main.getInitZoom();
            canvas.setZoom(zoom);

            var x = ((canvas.width - 100) / zoom - img.width) / 2 + 50;
            var y = ((canvas.height - 100) / zoom - img.height) / 2;
            me.imgObj = img.set({left:x, top:y, width:img.width, height:img.height, originX: 'left', originY: 'top', opacity: me.transvalue / 100.0});
            me.arrAllObjs.push(me.imgObj);

            me.shape = new fabric.Group(me.arrAllObjs,
            {
                borderColor:'#669933',
                lockUniScaling:true,
                cornerColor:gcolor_blockselborder,
                transparentCorners:false,
                objtype:'ArenaObj',
                /*selectable:false,
                hoverCursor:'default'*/
            });
            canvas.add(me.shape);
            canvas.sendToBack(me.shape);
            me.shapeInitFunctions();
            canvas.setActiveObject(me.shape);

            var progressModal = document.getElementById('progressModal');
            progressModal.style.display = "none";

            me.createOk();
            canvas.absolutePan(new fabric.Point(0, 0));
            canvas.renderAll();

            if(main.callbackLoaded)
                main.callbackLoaded.call();
            // onCreatedArena();
        });
    },

    shapeInitFunctions: function() {
        var self = this;

        this.shape.on('selected', function () {
            gselectedObj = self;
            self.showProperty();
        });

        this.shape.on('moving', function() {
            self.hideProperty();
        });

        this.shape.on('scaling', function() {
            self.hideProperty();
        });

        this.shape.on('rotating', function() {
            self.hideProperty();
        });

        this.shape.on('modified', function() {
            self.showProperty();
        });
    },

    showProperty: function() {
        this.hideProperty('all');
        if(this.status == 'creating') {
            this.setPositionPropertyFrame(this.propertyCreating);
            this.propertyCreating.show();

            gsetslidervalueflag = true;
            this.transslider.slider("option", "value", this.transvalue);
            $('#transvalue').html('Transparency : ' + this.transvalue + '%');
        }
    },

    hideProperty: function(sflag) {
        if(typeof(sflag)==='undefined') {
            this.propertyCreating.hide();
        }
        else {
            //all hide
            hideAllProperty();
        }
    },

    //Creating Buttons
    createOk: function() {
        this.status = 'created';

        this.shape.selectable = false;
        this.shape.evented = false;
        this.shape.hoverCursor = 'default';

        this.propertyCreating.hide();
        canvas.deactivateAll().renderAll();
    },

    //Normal status Buttons
    deleteObj : function() {
        this.hideProperty();

        canvas.remove(this.shape);
        canvas.renderAll();
        
        gselectedObj = null;
        //dealloc this class

        return 0; //0 seats
    },
    changedTransvalue : function(v) {
        this.transvalue = v;
        $('#transvalue').html('Transparency : ' + v + '%');

        this.imgObj.opacity = v / 100.0;
        canvas.renderAll();
    },
    setPositionPropertyFrame : function(property) {
        var xxx = gDrawBoard.offset().left + gDrawBoard.width() - 40- property.width();
        var yyy = gDrawBoard.offset().top + 10;

        property.css('left', xxx);
        property.css('top', yyy);
    },
});