public class AdminSession
{
    public bool IsAdmin { get; private set; } = false;

    public void LoginAdmin()
    {
        IsAdmin = true;
    }

    public void Logout()
    {
        IsAdmin = false;
    }
}
