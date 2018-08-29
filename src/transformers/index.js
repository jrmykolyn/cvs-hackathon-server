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

module.exports = {
    products,
    product,
};
