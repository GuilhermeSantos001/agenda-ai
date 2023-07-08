# Testando as rotas

> [🔙Clique para voltar](/README.md)

O projeto está usando GraphQL e iremos usar o Insomnia para testar as rotas.

### Rota de criação dos medicos

Vamos criar um médico com os seguintes dados:

```JSON
mutation CreateDoctor {
	addDoctor(newDoctorData: {
		name: "Francisco Cesar",
		email: "francisco_cesar@gmail.com",
		documents: {
			rg: "99.999.999-8",
			cpf: "999.999.999-88"
		}
	}) {
		name
		email
		documents
		created_at
		updated_at
	}
}
```

![AnVIL Image](/docs/images/2023-07-07_22-52.png)
![AnVIL Image](/docs/images/2023-07-07_22-53.png)

Você pode ver os dados armazenados no **MongoDB** usando o [Compass](https://www.mongodb.com/try/download/compass).

![AnVIL Image](/docs/images/2023-07-07_22-56.png)
![AnVIL Image](/docs/images/2023-07-07_22-56_1.png)
![AnVIL Image](/docs/images/2023-07-07_22-55.png)

### Agendando uma consulta

Agora que já temos nosso médico vamos criar uma consulta.

Vamos ver como está a agenda dele:

```JSON
{
	doctorScheduleMonthly(scheduleMonthlyData: {
		hour: null,
		minute: null,
		day: null,
		month: null,
	})
}
```

![AnVIL Image](/docs/images/2023-07-07_23-00.png)
![AnVIL Image](/docs/images/2023-07-07_23-01.png)

Vamos entender os filtros,

- hour: **Se definido então o sistema irá considerar a hora informada**
- minute: **Se definido então o sistema irá considerar o minuto informado**
- day: **Se definido então o sistema irá considerar o dia informado**
- month: **Se definido então o sistema irá considerar o mês informado**

Agora sabemos que nosso médico está livre vamos criar o agendamento.

> Essa é uma rota que irá utilizar o sistema de fila e mensageira, você poderá acessar o painel do [RabbitMQ](http://localhost:15672) para acompanhar o envio da mensagem se desejar. Dados de acesso do painel: (user: rabbitmq & senha: rabbitmq)

![AnVIL Image](/docs/images/2023-07-07_23-09.png)
![AnVIL Image](/docs/images/2023-07-07_23-09_1.png)

Iremos usar os seguintes dados para o agendamento:

```JSON
mutation AddSchedule {
	addSchedule(newScheduleData: {
		hour: 11,
		minute: 0,
		day: 8,
		month: 7,
		year: 2023,
		patient: {
			name: "John Doe",
			email: "john@outlook.com",
			phone: "999999999"
		}
	})
}
```

![AnVIL Image](/docs/images/2023-07-07_23-05.png)
![AnVIL Image](/docs/images/2023-07-07_23-11.png)

> Ops acabamos de receber a seguinte mensagem: "Sorry our doctors only work on weekdays." - Mas isso está correto, nossos médicos só trabalham de segunda a sexta das 9h às 18h.

Vamos alterar o dia para a próxima segunda-feira dia 10.

```JSON
mutation AddSchedule {
	addSchedule(newScheduleData: {
		hour: 11,
		minute: 0,
		day: 10,
		month: 7,
		year: 2023,
		patient: {
			name: "John Doe",
			email: "john@outlook.com",
			phone: "999999999"
		}
	})
}
```

![AnVIL Image](/docs/images/2023-07-07_23-14.png)

Perfeito, agora vamos dar uma olhada no log gerado em nosso sistema.

![AnVIL Image](/docs/images/2023-07-07_23-15.png)
![AnVIL Image](/docs/images/2023-07-07_23-15_1.png)

Vamos ver as consultas agendadas:

```JSON
{
	patientSchedules(patientSchedulesData: {
		doctor: null,
		patient: null,
	})
}
```

![AnVIL Image](/docs/images/2023-07-07_23-16.png)