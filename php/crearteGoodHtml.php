<?php
// 以所有权限打开templets.html文件
$fp = fopen ( 'detailModel.html', 'a' );

// $goodId = $_GET

// 如果此文件存在
if ( $fp ) {
    // 读取此文件
    $fup = fread ( $fp, filesize( 'templets.html' ) );
    // 以有写入的权限打开或生成另一个文件
    $fp2 = fopen ( 'html.shtml', 'w' );
    if ( $fwrite ( $fp2, $fup ) ) {
        fclose ( $fp );
        fcolse ( $fp2 );
        die ( '写入模板成功' );
    } else {
        fclose ( $fp );
        die ( '写入模板失败!' );
    }
}

?>