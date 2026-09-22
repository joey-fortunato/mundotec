<?php

return [
    /*
     * Configuração do gateway Multicaixa Express (EMIS / agregador).
     * Em produção, definir as credenciais via variáveis de ambiente. Enquanto
     * não houver integração, os pagamentos ficam pendentes até liquidação.
     */
    'multicaixa' => [
        'merchant' => env('MUNDOTEC_MCX_MERCHANT'),
        'pos_id' => env('MUNDOTEC_MCX_POS_ID'),
        'callback_secret' => env('MUNDOTEC_MCX_CALLBACK_SECRET'),
    ],

    /*
     * Ao liquidar um pagamento, libertar o acesso ao curso já na primeira
     * prestação (true) ou apenas quando a encomenda estiver totalmente paga
     * (false).
     */
    'grant_access_on_first_installment' => true,
];
