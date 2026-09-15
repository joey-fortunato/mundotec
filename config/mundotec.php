<?php

return [
    /*
     * Dados bancários mostrados ao aluno nas instruções de pagamento por
     * transferência. Definir em produção via variáveis de ambiente.
     */
    'bank' => [
        'name' => env('MUNDOTEC_BANK_NAME', 'Banco (definir)'),
        'account_holder' => env('MUNDOTEC_BANK_HOLDER', 'Mundo da Tecnologia'),
        'iban' => env('MUNDOTEC_BANK_IBAN', 'AO06 0000 0000 0000 0000 0000 0'),
    ],

    /*
     * Ao confirmar um pagamento, libertar o acesso ao curso já na primeira
     * prestação (true) ou apenas quando a encomenda estiver totalmente paga
     * (false).
     */
    'grant_access_on_first_installment' => true,
];
