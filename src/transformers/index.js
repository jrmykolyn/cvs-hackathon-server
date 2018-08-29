const product = ( record ) => {
    const variant = record.variants[ 0 ].subVariant[ 0 ];

    return {
        skuId: variant.p_Sku_ID,
        title: record.title,
        rating: variant.p_Product_Rating,
        img: variant.BV_ImageUrl,
    };
};

const products = ( records ) => {
    return {
        items: records.map( record => record.allMeta ).map( data => product( data ) ),
    };
};

const variants = ( records ) => {
    return records.map(({ allMeta }) => allMeta )
        .map( data => data.variants )
        .reduce( ( acc, variants ) => ([ ...acc, ...variants ]), [] )
        .map( variant => variant.subVariant[ 0 ] )
        .map( subVariant => {
            return {
                name: subVariant.p_Sku_ShortName,
                slug: subVariant.p_Sku_ID,
                rating: subVariant.p_Product_Rating,
                price: subVariant.gbi_Actual_Price,
                images: [ subVariant.BV_ImageUrl ],
            }
        } );
};

module.exports = {
    product,
    products,
    variants,
};
