// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Vendor
const clone = require( 'clone' );
const cors = require( 'cors' );
const ejs = require( 'ejs' );
const express = require( 'express' );
const { Query, BrowserBridge } = require( 'groupby-api' );

// Project
const CONFIG = require( './config' );
const DATA = require( './src/data' );
const TRANSFORMERS = require( './src/transformers' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
const bridge = new BrowserBridge( 'cvshealth', true );
const app = express();
const PORT = 8080;

// --------------------------------------------------
// ENDPOINTS
// --------------------------------------------------
app.set( 'view engine', 'ejs' );
app.use( cors() );

// View routes.
app.get( '/sku/:skuId', ( req, res ) => {
    const q = new Query()
        .withConfiguration( CONFIG )
        .withSelectedRefinements({
            navigationName: 'id',
            value: String(req.params.skuId),
            type: 'Value',
        });

    // TODO: Define timeout for config.
    bridge.search( q.request, ( err, data ) => {
        if ( err ) {
            res.send( '__FAILED__' ); // TEMP
            // TODO: Return error.
        }

        const variants = TRANSFORMERS.variants( data.records );

        let payload = {
            state: {
                "moreItemsPageIndex": 0,
                "hasMorePages": true,
                selectedVariantIndex: 0,
                variants,
            },
        };

        payload.state = variants.reduce( ( acc, variant ) => ({ ...acc, [`selectedSlideFor${variant.name}`]: 0 }), payload.state );

        // Make data dynamic.
        res.render( 'index', payload );
    } );
} );

// API routes.
app.get( '/api/ymal/:skuId', ( req, res ) => {
    res.json( { items: new Array( 5 ).fill( null ).map( () => ({
        name: '__FOO__',
        img: 'https://via.placeholder.com/200x200?text=IMG',
        price: '0.00',
        rating: '5'
    }) ) } );
} );

// --------------------------------------------------
// INIT
// --------------------------------------------------
app.listen( PORT, () => {
    console.log( `LISTENING ON PORT: ${PORT}` );
} );
