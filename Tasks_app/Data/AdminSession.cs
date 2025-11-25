public class AdminSession
{
    public bool IsAdmin { get; private set; } = false; // флаг администратора

    public void LoginAdmin() // включаем режим админа
    {
        IsAdmin = true;
    }

    public void Logout() // выходим
    {
        IsAdmin = false;
    }
}
