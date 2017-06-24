ImageObj = function(x, y, cloneObj) {
    this.propertyCreating = $('#image_create');

    this.transslider = $('#transslider');

    //Create new
    if(typeof(cloneObj)==='undefined')
        this.init(x, y);
    else {
        if( cloneObj.type =='group' )
            this.fromGroupObj(cloneObj);
        else
            this.clone(cloneObj);
    }
}

$.extend(ImageObj.prototype, {
    // object variables
    class_name: 'ImageObj',
    type: 'ImageObj',

    imgpath: 'images/upload/default.png',
    transvalue: 100,
  
    shape: null,
    imgObj : null, //image
    arrAllObjs : null,

    total : 0,
    
    status : '', //creating, normal

    init: function(x, y) {
        this.status = 'creating';

        this.createObjs(x, y);
        //canvas.setActiveObject(this.shape);
    },

    clone: function(cloneObj) {
        var x = cloneObj.shape.left + cloneObj.shape.width;
        var y = cloneObj.shape.top + cloneObj.shape.height;
        var scalex = cloneObj.shape.scaleX;
        var scaley = cloneObj.shape.scaleY;
        var oldAngle = cloneObj.shape.angle;

        this.arrAllObjs = [];
        this.imgObj = null;
        this.shape = null;

        this.status = cloneObj.status;
        this.imgpath = cloneObj.imgpath;
        this.transvalue = cloneObj.transvalue;

        var me = this;
        fabric.Image.fromURL(this.imgpath, function(img) {
            me.imgObj = img.set({left:x, top:y, width:img.width, height:img.height, originX: 'center', originY: 'center', opacity: me.transvalue / 100.0, crossOrigin: 'anonymous'});
            me.arrAllObjs.push(me.imgObj);

            me.shape = new fabric.Group(me.arrAllObjs, {
                angle:oldAngle, scaleX:scalex, scaleY:scaley, 
                borderColor:'#669933', 
                lockUniScaling:true, cornerColor:'green', 
                transparentCorners:false, 
                objtype:'ImageObj',
                parentObj: me,
            });
            canvas.add(me.shape);
            canvas.sendToBack(me.shape);
            me.shapeInitFunctions();
            canvas.deactivateAll().renderAll();
            me.hideProperty('all');
            gselectedObj = null;
        });
    },

    fromGroupObj: function(groupobj) {
        this.status = 'normal';

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

    //Create All of Objects for Square
    createObjs: function(x, y) {
        if(x == 0 && y == 0) {
            x = this.shape.left + this.shape.width / 2;
            y = this.shape.top + this.shape.height / 2;
        }
        var oldAngle = 0;
        
        //remove old shape
        if(this.shape != null) {
            oldAngle = this.shape.angle;
            canvas.remove(this.shape);
        }

        this.arrAllObjs = [];
        this.imgObj = null;

        var me = this;
        fabric.Image.fromURL(this.imgpath, function(img) {
            me.imgObj = img.set({left:x, top:y, width:img.width, height:img.height, originX: 'center', originY: 'center', opacity: me.transvalue / 100.0, crossOrigin: 'anonymous'});
            me.arrAllObjs.push(me.imgObj);

            me.shape = new fabric.Group(me.arrAllObjs, {
                angle:oldAngle, borderColor:'#669933', lockUniScaling:true, cornerColor:'green', transparentCorners:false,
                objtype:'ImageObj',
                parentObj: me,
            });
            canvas.add(me.shape);
            canvas.sendToBack(me.shape);
            me.shapeInitFunctions();
            canvas.setActiveObject(me.shape);

            var progressModal = document.getElementById('progressModal');
            progressModal.style.display = "none";
        });
    },

    shapeInitFunctions: function() {
        var self = this;

        this.shape.on('selected', function () {
            // if(gselectedObj != null && gselectedObj.status == 'creating') {
            //     gseatsTotal += gselectedObj.createOk();
            //     $('#seatstotal').text('' + gseatsTotal);
            // }

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
        }
        else if(this.status == 'normal') {
            this.setPositionPropertyFrame($('#image_normal'));
            $('#image_normal').show();

            gsetslidervalueflag = true;
            this.transslider.slider( "option", "value", this.transvalue );
            $('#transvalue').html('Transparency : ' + this.transvalue + '%');
        }
    },

    hideProperty: function(sflag) {
        if(typeof(sflag)==='undefined') {
            if(this.status == 'creating') {
                this.propertyCreating.hide();
            }
            else if(this.status == 'normal') {
                $('#image_normal').hide();
            }
        }
        else {
            $('#sections_create').hide();
            $('#sections_normal').hide();
            $('#sections_edit').hide();

            $('#square_create').hide();
            $('#square_normal').hide();
            $('#square_edit').hide();

            $('#tcircle_create').hide();
            $('#tcircle_normal').hide();
            $('#tcircle_edit').hide();

            $('#tsquare_create').hide();
            $('#tsquare_normal').hide();
            $('#tsquare_edit').hide();

            $('#objects_create').hide();
            $('#objects_normal').hide();

            $('#text_create').hide();
            $('#text_normal').hide();

            $('#image_create').hide();
            $('#image_normal').hide();
        }
    },

    //Creating Buttons
    createOk: function(withuploadedfile) {
        gselectedObj = null;
        this.status = 'normal';
        
        if(typeof(withuploadedfile)!=='undefined') {
            this.imgpath = absoluteurl+'/assets/seatingmap/images/upload/' + withuploadedfile
            this.createObjs(0, 0);
        }

        this.propertyCreating.hide();
        canvas.deactivateAll().renderAll();

        return 0; //0 seats
    },
    createCancel: function() {
        this.propertyCreating.hide();
        canvas.remove(this.shape);
        canvas.renderAll();

        gselectedObj = null;
        //dealloc this class
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
    editObj : function() {
    },
    changedTitle : function() {
    },
    changedTransvalue : function(v) {
        this.transvalue = v;
        $('#transvalue').html('Transparency : ' + v + '%');

        this.imgObj.opacity = v / 100.0;
        canvas.renderAll();
    },
    setPositionPropertyFrame : function(property) {
        /*if(this.status == 'editing') {
            property.css('left', gDrawBoard.offset().left + gDrawBoard.width() - 40- property.width());
        }
        else {*/
            var boundRect = this.shape.getBoundingRect();
            var xxx = gDrawBoard.offset().left + boundRect.left +  boundRect.width / 2 - property.width() / 2 - 20;
            var yyy = gDrawBoard.offset().top + boundRect.top + boundRect.height + 40;

            if(yyy + property.height() + 40> gDrawBoard.offset().left + gDrawBoard.height()) {
                xxx = gDrawBoard.offset().left + gDrawBoard.width() - 40- property.width();
                yyy = gDrawBoard.offset().top;
            }
            property.css('left', xxx);
            property.css('top', yyy);
        //}
    }
});