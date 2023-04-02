echo Migration already done!
goto :eof
powershell -Command "(gc -Raw 'F:\FOLDERS\Work\Contracts\Singular\billed\Mandat 3\punch_mandat_3.txt') | Foreach-Object {$_ -replace 'in ', '' -replace '\nout', ' ->'  } | Set-Content 'F:\FOLDERS\Work\Contracts\Singular\billed\Mandat 3\punch_mandat_3_v2.txt'"
powershell -Command "(gc -Raw 'F:\FOLDERS\Work\Contracts\Singular\billed\Mandats 1 et 2\punch_mandats_1_2.txt') | Foreach-Object {$_ -replace 'in ', '' -replace '\nout', ' ->'  } | Set-Content 'F:\FOLDERS\Work\Contracts\Singular\billed\Mandats 1 et 2\punch_mandats_1_2_v2.txt'"
powershell -Command "(gc -Raw 'F:\FOLDERS\Work\Contracts\Lyo-Sublima\punch.txt') | Foreach-Object {$_ -replace 'in ', '' -replace '\nout', ' ->'  } | Set-Content 'F:\FOLDERS\Work\Contracts\Lyo-Sublima\punch_v2.txt'"
powershell -Command "(gc -Raw 'F:\FOLDERS\Work\Contracts\Lyo-Sublima\cons.txt') | Foreach-Object {$_ -replace 'in ', '' -replace '\nout', ' ->'  } | Set-Content 'F:\FOLDERS\Work\Contracts\Lyo-Sublima\cons_v2.txt'"
powershell -Command "(gc -Raw 'F:\FOLDERS\Work\Contracts\Lyo-Sublima\invoices\2022-10-001\cons.txt') | Foreach-Object {$_ -replace 'in ', '' -replace '\nout', ' ->'  } | Set-Content 'F:\FOLDERS\Work\Contracts\Lyo-Sublima\invoices\2022-10-001\cons_v2.txt'"
powershell -Command "(gc -Raw 'F:\FOLDERS\Work\Contracts\Lyo-Sublima\invoices\2022-10-001\punch.txt') | Foreach-Object {$_ -replace 'in ', '' -replace '\nout', ' ->'  } | Set-Content 'F:\FOLDERS\Work\Contracts\Lyo-Sublima\invoices\2022-10-001\punch_v2.txt'"
powershell -Command "(gc -Raw 'F:\FOLDERS\Work\Contracts\Sino\punch.txt') | Foreach-Object {$_ -replace 'in ', '' -replace '\nout', ' ->'  } | Set-Content 'F:\FOLDERS\Work\Contracts\Sino\punch_v2.txt'"
