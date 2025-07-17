**Sistema de Notificações com Garantia de Entrega**  
*Stack: Fastify (Node) + BullMQ (Redis) + ReactJs*  

Arquitetura fullstack para entrega confiável de notificações com:  
- Filas persistentes e retry de falhas (BullMQ)  
- API otimizada com Fastify  
- Client ReactJs com real-time via Socket.io  
- Mecanismos de DLQ e replay de mensagens  

A aplicação simula transferências bancárias com taxa de falha configurável de 30%. 
Em transações bem-sucedidas, ambas as partes recebem notificações em tempo real no cliente React com detalhes da operação. 
Em falhas, apenas o remetente é notificado sobre o erro, garantindo comunicação diferenciada conforme o resultado da transação.
O principal objetivo é garantir a entrega das notificações quando uma grande quantidade de transferências ocorre ao mesmo tempo. 
