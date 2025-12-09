using Npgsql;

public class Database
{
    private readonly string _connStr;

    public Database(IConfiguration config)
    {
        // Читаем строку подключения из переменной окружения systemd
        _connStr = Environment.GetEnvironmentVariable("DB_CONN");
    }

    public NpgsqlConnection GetConnection()
    {
        return new NpgsqlConnection(_connStr);   // создаём подключение
    }
}
