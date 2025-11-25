using Npgsql;

    public class Database
    {
        private readonly IConfiguration _config;

        public Database(IConfiguration config)
        {
            _config = config;
        }

        public NpgsqlConnection GetConnection()
        {
            string connStr = "Host=185.225.202.224;Port=5432;Database=db_tasks;Username=postgres;Password=Orhedeya0000;";
            return new NpgsqlConnection(connStr);
        }
    }
